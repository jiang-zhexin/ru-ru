import { db } from "@/db/db.ts";
import { geoipTable } from "@/db/schema.ts";
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

    let results = geoipList.entry.flatMap(({ countryCode, cidr }) =>
      cidr.map((c) => {
        const addr = c.ip.length === 4
          ? Address.fromIPv4Bytes(c.ip)
          : Address.fromIPv6Bytes(c.ip);

        const { from, to } = AddressPrefix.from(addr, c.prefix).getRanges();

        return {
          tag: countryCode.toLowerCase(),
          startIp: Buffer.from(Address.parseAddress(from).toByteArray()),
          endIp: Buffer.from(Address.parseAddress(to).toByteArray()),
          prefixLength: c.prefix,
        } satisfies typeof geoipTable.$inferInsert;
      })
    );

    const telegramCidr = await step.do("fetch telegram cidr", async () => {
      const response = await fetch(
        "https://core.telegram.org/resources/cidr.txt",
      );
      if (!response.ok) throw new Error("can not fetch geoip");
      return await response.text();
    });

    results = results.concat(
      telegramCidr.trimEnd().split("\n").map((cidr) => {
        const prefix = AddressPrefix.parsePrefix(cidr);
        const { from, to } = prefix.getRanges();
        return {
          tag: "telegram",
          startIp: Buffer.from(Address.parseAddress(from).toByteArray()),
          endIp: Buffer.from(Address.parseAddress(to).toByteArray()),
          prefixLength: prefix.getBits(),
        };
      }),
    );

    console.log(`all geoip: ${results.length}`);

    const MAX_CHUNK = 5000;
    const batches = chunk(results, MAX_CHUNK);

    await step.do("atomic overwrite geoip", async () => {
      await db().transaction(async (tx) => {
        await tx.execute(sql`TRUNCATE TABLE ${geoipTable};`);
        for (const value of batches) {
          await tx.insert(geoipTable).values(value).onConflictDoNothing();
        }
      });
    });

    console.log("overwrite geoip success");
  }
}
