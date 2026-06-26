import { db } from "@/db/db.ts";
import { geoipTable } from "@/db/schema.ts";
import type { GeoipFilterParams } from "@/types/geoip.ts";
import type { Version } from "@/types/utils.ts";
import { convertVersion } from "@/utils/version.ts";
import { geoipFilter } from "@/validator/geoip.ts";
import { zValidator } from "@hono/zod-validator";
import { type RuleSet, writeSrs } from "@zhexin/srs";
import { and, inArray, notInArray } from "drizzle-orm";
import { Hono } from "hono";
import { Address, AddressPrefix } from "netip-ts";

const geoip = new Hono()
  .get(
    "/",
    zValidator("query", geoipFilter),
    async (c) => c.json<string[]>(await filter(c.req.valid("query"))),
  )
  .get("/tags", async (c) => {
    const uniqueTags = await db()
      .selectDistinct({ tag: geoipTable.tag })
      .from(geoipTable)
      .then((rows) => rows.map((r) => r.tag));

    return c.json<string[]>(uniqueTags);
  })
  .get(
    "/:filename{.+\\.json}",
    zValidator("query", geoipFilter),
    async (c) => {
      const { filename } = c.req.param();
      const q = c.req.valid("query");
      const results = await filter(q);
      const ruleSet = toRuleSet(results, q.v);
      return c.json<RuleSet>(ruleSet, {
        headers: {
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    },
  ).get(
    "/:filename{.+\\.srs}",
    zValidator("query", geoipFilter),
    async (c) => {
      const { filename } = c.req.param();
      const q = c.req.valid("query");
      const results = await filter(q);
      const ruleSet = toRuleSet(results, q.v);
      const srs = writeSrs(ruleSet);
      return c.newResponse(srs, {
        headers: {
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    },
  );

export type geoip = typeof geoip;
export default geoip;

async function filter(q: GeoipFilterParams): Promise<string[]> {
  const results = await db()
    .select()
    .from(geoipTable)
    .where(
      and(
        inArray(geoipTable.tag, [...new Set(q.t)]),
        q.et ? notInArray(geoipTable.tag, [...new Set(q.et)]) : undefined,
      ),
    );
  return results.map(({ startIp, prefixLength }) => {
    const addr = startIp.length === 4
      ? Address.fromIPv4Bytes(startIp)
      : Address.fromIPv6Bytes(startIp);

    const cidr = AddressPrefix.from(addr, prefixLength);

    return cidr.toString();
  });
}

function toRuleSet(results: string[], version: Version): RuleSet {
  return {
    version: convertVersion(version),
    rules: [{ ip_cidr: results }],
  };
}
