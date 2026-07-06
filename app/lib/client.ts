import { hc } from "hono/client";
import type { geosite } from "@/api/v1/geosite.ts";

export const defaultUrl = new URL("/api/v1/geosite", globalThis.location.href);
export const client = hc<geosite>(defaultUrl.toString());
