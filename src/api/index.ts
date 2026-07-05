import v1 from "@/api/v1/index.ts";
import { env } from "cloudflare:workers";
import { Hono } from "hono";
import { cache } from "hono/cache";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

const api = new Hono();

if (env.DEV) api.use(logger());

api.use(prettyJSON({ force: env.DEV ? true : false }));

api.use(
  cache({
    cacheName: "v1",
    cacheControl: "public,max-age=86400",
  }),
);

api.route("/v1", v1);

export default api;
