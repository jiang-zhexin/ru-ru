import { geositeTable } from "@/db/schema.ts";
import { format, geositeFilter } from "@/validator/geosite.ts";
import * as z from "zod";

export type GeositeRow = typeof geositeTable.$inferSelect;

export type GeositeFilterParamsInput = z.input<typeof geositeFilter>;
export type GeositeFilterParams = z.output<typeof geositeFilter>;
export type Format = z.input<typeof format>;

export type RawDomain = Omit<GeositeRow, "tag">[];
