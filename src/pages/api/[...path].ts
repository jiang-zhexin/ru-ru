import v1 from "@/api/v1/index.ts";
import { env } from "cloudflare:workers";
import { Hono } from "hono";
import { cache } from "hono/cache";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import type { APIRoute } from "astro";

const api = new Hono().basePath("/api");

if (import.meta.env.DEV) {
  api.use(logger());
  api.use(prettyJSON({ force: true }));
}

api.use(
  cache({
    cacheName: "v1",
    cacheControl: "public,max-age=86400",
  }),
);

api.route("/v1", v1);

export const ALL: APIRoute = (c) =>
  api.fetch(c.request, env, c.locals.cfContext);
export const prerender = false;
