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
import { sumBy } from "es-toolkit/math";

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

    /**
     * because maximum bound parameters per query is 100.
     * https://developers.cloudflare.com/d1/platform/limits/
     *
     * 33 is 100/3
     */
    const MAX_CHUNK = 33;
    const batches = chunk(results, MAX_CHUNK * 100);

    let rows_written = 0;

    for (const [index, value] of batches.entries()) {
      rows_written += await step.do(
        `insert geosite db, id: ${index}`,
        async () => {
          const batchPromises = chunk(value, MAX_CHUNK).map((r) =>
            db.insert(geositeTableNew).values(r).onConflictDoNothing()
          );
          type T = typeof batchPromises[number];
          const batchRes = await db.batch(batchPromises as [T, ...T[]]);

          return sumBy(batchRes, (item) => item.meta.rows_written);
        },
      );

      if (!this.env.DEV && rows_written > 80000) {
        await step.sleep(`now is ${index}, sleep 1 day then continue`, "1 day");
        rows_written = 0;
      }
    }

    console.log("insert geosite success");

    await step.do("rotation table", async () => {
      await db.batch([
        db.run(sql`ALTER TABLE geosite RENAME TO geosite_old;`),
        db.run(sql`ALTER TABLE geosite_new RENAME TO geosite;`),
        db.run(sql`ALTER TABLE geosite_old RENAME TO geosite_new;`),
      ]);
    });

    console.log("rotation geosite success");

    if (!this.env.DEV) await step.sleep("sleep 1 day then clearup", "1 day");

    await step.do("clear tmp table", async () => {
      await db.delete(geositeTableNew);
    });

    console.log("clear tmp table success");
  }
}
