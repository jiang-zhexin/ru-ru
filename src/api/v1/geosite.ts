import { db } from "@/db/db.ts";
import { geositeTable } from "@/db/schema.ts";
import type {
  Format,
  GeositeFilterParams,
  RawDomain,
} from "@/types/geosite.ts";
import type { Version } from "@/types/utils.ts";
import { convertVersion } from "@/utils/version.ts";
import { geositeFilter } from "@/validator/geosite.ts";
import { zValidator } from "@hono/zod-validator";
import { type RuleSet, writeSrs } from "@zhexin/srs";
import { and, inArray, notInArray, type SQL, sql } from "drizzle-orm";
import { except, union } from "drizzle-orm/sqlite-core";
import { groupBy } from "es-toolkit/array";
import { Hono } from "hono";

const geosite = new Hono()
  .get(
    "/",
    zValidator("query", geositeFilter),
    async (c) => c.json<RawDomain>(await filter(c.req.valid("query"))),
  )
  .get("/tags", async (c) => {
    const uniqueTags = await db
      .selectDistinct({ tag: geositeTable.tag })
      .from(geositeTable)
      .then((rows) => rows.map((r) => r.tag));

    return c.json<string[]>(uniqueTags);
  })
  .get(
    "/:filename{.+\\.json}",
    zValidator("query", geositeFilter),
    async (c) => {
      const q = c.req.valid("query");
      const results = await filter(q);
      const ruleSet = toRuleSet(results, q.v);
      return c.json<RuleSet>(ruleSet);
    },
  ).get(
    "/:filename{.+\\.srs}",
    zValidator("query", geositeFilter),
    async (c) => {
      const q = c.req.valid("query");
      const results = await filter(q);
      const ruleSet = toRuleSet(results, q.v);
      const srs = writeSrs(ruleSet);
      return c.newResponse(srs);
    },
  );

export type geosite = typeof geosite;
export default geosite;

async function filter(q: GeositeFilterParams): Promise<RawDomain> {
  const baseQuery = db
    .select({ format: geositeTable.format, domain: geositeTable.domain })
    .from(geositeTable)
    .where(
      and(
        inArray(geositeTable.tag, [...new Set(q.t)]),
        q.et ? notInArray(geositeTable.tag, [...new Set(q.et)]) : undefined,
        inArray(geositeTable.format, [...new Set(q.f)]),
      ),
    );

  const includeSqlChunks: SQL[] = [];
  if (q.d) includeSqlChunks.push(...q.d.map((d) => sql`('full', ${d})`));
  if (q.ds) includeSqlChunks.push(...q.ds.map((d) => sql`('domain', ${d})`));
  if (q.dk) includeSqlChunks.push(...q.dk.map((d) => sql`('keyword', ${d})`));
  if (q.dr) includeSqlChunks.push(...q.dr.map((d) => sql`('regexp', ${d})`));

  const includeQuery = db
    .select({ format: sql<Format>`column1`, domain: sql<string>`column2` })
    .from(
      sql`(VALUES ${sql.join(includeSqlChunks, sql.raw(`, `))})`,
    );

  const excludeSqlChunks: SQL[] = [];
  if (q.ed) excludeSqlChunks.push(...q.ed.map((d) => sql`('full', ${d})`));
  if (q.eds) excludeSqlChunks.push(...q.eds.map((d) => sql`('domain', ${d})`));
  if (q.edk) excludeSqlChunks.push(...q.edk.map((d) => sql`('keyword', ${d})`));
  if (q.edr) excludeSqlChunks.push(...q.edr.map((d) => sql`('regexp', ${d})`));

  const excludeQuery = db
    .select({ format: sql<Format>`column1`, domain: sql<string>`column2` })
    .from(
      sql`(VALUES ${sql.join(excludeSqlChunks, sql.raw(`, `))})`,
    );

  if (includeSqlChunks.length > 0 && excludeSqlChunks.length > 0) {
    return await except(union(baseQuery, includeQuery), excludeQuery);
  }
  if (includeSqlChunks.length > 0) {
    return await union(baseQuery, includeQuery);
  }
  if (excludeSqlChunks.length > 0) {
    return await except(baseQuery, excludeQuery);
  }
  return await baseQuery;
}

function toRuleSet(results: RawDomain, version: Version): RuleSet {
  const {
    full,
    suffix,
    keyword,
    regexp,
  } = groupBy(results, (r) => r.format);

  return {
    version: convertVersion(version),
    rules: [{
      domain: full?.map((e) => e.domain),
      domain_suffix: suffix?.map((e) => e.domain),
      domain_keyword: keyword?.map((e) => e.domain),
      domain_regex: regexp?.map((e) => e.domain),
    }],
  };
}
