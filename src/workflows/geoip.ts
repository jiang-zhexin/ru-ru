import { db } from "@/db/db.ts";
import { geoipTableNew } from "@/db/schema.ts";
import { GeoIPListSchema } from "@/gen/geoip_pb.ts";
import { fromBinary } from "@bufbuild/protobuf";
import {
  WorkflowEntrypoint,
  type WorkflowEvent,
  type WorkflowStep,
} from "cloudflare:workers";
import { sql } from "drizzle-orm";
import { chunk } from "es-toolkit/array";
import { Address, AddressPrefix } from "netip-ts";
import { Buffer } from "node:buffer";

type Params = never;

export class SyncGeoIP extends WorkflowEntrypoint<Env, Params> {
  override async run(_event: WorkflowEvent<Params>, step: WorkflowStep) {
    const geoipBin = await step.do("fetch geoip", async () => {
      const response = await fetch(
        "https://github.com/v2fly/geoip/releases/latest/download/cn.dat",
      );
      if (!response.ok) throw new Error("can not fetch geoip");
      return response.body;
    });

    const geoipList = fromBinary(
      GeoIPListSchema,
      await new Response(geoipBin).bytes(),
    );

    const results = geoipList.entry.flatMap(({ countryCode, cidr }) =>
      cidr.map((c) => {
        const addr = c.ip.length === 4
          ? Address.fromIPv4Bytes(c.ip)
          : Address.fromIPv6Bytes(c.ip);

        const { from, to } = AddressPrefix.from(addr, c.prefix).getRanges();

        return {
          tag: countryCode,
          startIp: Buffer.from(Address.parseAddress(from).toByteArray()),
          endIp: Buffer.from(Address.parseAddress(to).toByteArray()),
          prefixLength: c.prefix,
        };
      })
    ) satisfies typeof geoipTableNew.$inferInsert[];

    console.log(`all geoip: ${results.length}`);

    await step.do("update geoip db", async () => {
      await db.batch([
        db.delete(geoipTableNew),
        ...chunk(results, 25).map((r) =>
          db.insert(geoipTableNew).values(r).onConflictDoNothing()
        ),
      ]);
    });

    await step.do("rotation table", async () => {
      await db.batch([
        db.run(sql`ALTER TABLE geoip RENAME TO geoip_old;`),
        db.run(sql`ALTER TABLE geoip_new RENAME TO geoip;`),
        db.run(sql`ALTER TABLE geoip_old RENAME TO geoip_new;`),
      ]);
    });

    console.log("rotation geoip success");
  }
}
