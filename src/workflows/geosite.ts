import { db } from "@/db/db.ts";
import { geositeTable } from "@/db/schema.ts";
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
    ) satisfies typeof geositeTable.$inferInsert[];

    console.log(`all geosite: ${results.length}`);

    const MAX_CHUNK = 5000;
    const batches = chunk(results, MAX_CHUNK);

    await step.do("atomic overwrite geosite", async () => {
      await db().transaction(async (tx) => {
        await tx.execute(sql`TRUNCATE TABLE ${geositeTable};`);
        for (const value of batches) {
          await tx.insert(geositeTable).values(value).onConflictDoNothing();
        }
      });
    });

    console.log("overwrite geosite success");
  }
}
