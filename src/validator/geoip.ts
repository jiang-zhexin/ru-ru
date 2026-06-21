import * as z from "zod";
import { strArray, version } from "./utils.ts";

export const geoipFilter = z.object({
  v: version
    .optional()
    .default("2")
    .describe("version of sing-box rule-set"),

  t: strArray
    .describe("include tags"),
  et: strArray
    .optional()
    .describe("exclude tags"),
});
