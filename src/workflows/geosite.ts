import { db } from "@/db/db.ts";
import { geositeTableNew } from "@/db/schema.ts";
import { GeoSiteListSchema } from "@/gen/geosite_pb.ts";
import { domain_type_to_str } from "@/utils/domain_type.ts";
import { fromBinary } from "@bufbuild/protobuf";
import {
  WorkflowEntrypoint,
  type WorkflowEvent,
  type WorkflowStep,
} from "cloudflare:workers";
import { sql } from "drizzle-orm";
import { chunk } from "es-toolkit/array";

type Params = never;

export class SyncGeoSite extends WorkflowEntrypoint<Env, Params> {
  override async run(_event: WorkflowEvent<Params>, step: WorkflowStep) {
    const geositeBin = await step.do("fetch geosite", async () => {
      const response = await fetch(
        "https://github.com/v2fly/domain-list-community/releases/latest/download/dlc.dat",
      );
      if (!response.ok) throw new Error("can not fetch geosite");
      return response.body;
    });

    const geositeList = fromBinary(
      GeoSiteListSchema,
      await new Response(geositeBin).bytes(),
    );

    const results = geositeList.entry.flatMap(({ countryCode, domain }) =>
      domain.flatMap((d) => {
        const r = d.attribute.map((attr) => ({
          tag: "@" + attr.key,
          format: domain_type_to_str(d.type),
          domain: d.value,
        }));

        r.push({
          tag: countryCode.toLowerCase(),
          format: domain_type_to_str(d.type),
          domain: d.value,
        });

        return r;
      })
    ) satisfies typeof geositeTableNew.$inferInsert[];

    console.log(`all geosite: ${results.length}`);

    await step.do("update geosite db", async () => {
      await db.batch([
        db.delete(geositeTableNew),
        ...chunk(results, 33).map((r) =>
          db.insert(geositeTableNew).values(r).onConflictDoNothing()
        ),
      ]);
    });

    await step.do("rotation table", async () => {
      await db.batch([
        db.run(sql`ALTER TABLE geosite RENAME TO geosite_old;`),
        db.run(sql`ALTER TABLE geosite_new RENAME TO geosite;`),
        db.run(sql`ALTER TABLE geosite_old RENAME TO geosite_new;`),
      ]);
    });

    console.log("rotation geosite success");
  }
}
