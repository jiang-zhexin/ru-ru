import api from "@/api/index.ts";
import { Hono } from "hono";

const app = new Hono();

app.route("/api", api);

export default app;
export { SyncGeoIP } from "./workflows/geoip.ts";
export { SyncGeoSite } from "./workflows/geosite.ts";
