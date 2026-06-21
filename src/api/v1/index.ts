import { Hono } from "hono";
import geoip from "./geoip.ts";
import geosite from "./geosite.ts";

const v1 = new Hono();

v1.route("/geoip", geoip);
v1.route("/geosite", geosite);

export default v1;
