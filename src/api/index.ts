import v1 from "@/api/v1/index.ts";
import { env } from "cloudflare:workers";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";

const api = new Hono();

if (env.PRETTY_JSON) api.use(prettyJSON({ force: true }));

api.route("/v1", v1);

export default api;
