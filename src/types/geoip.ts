import { geoipTable } from "@/db/schema.ts";
import { geoipFilter } from "@/validator/geoip.ts";
import * as z from "zod";

export type GeoipRow = typeof geoipTable.$inferSelect;

export type GeoipFilterParamsInput = z.input<typeof geoipFilter>;
export type GeoipFilterParams = z.output<typeof geoipFilter>;
