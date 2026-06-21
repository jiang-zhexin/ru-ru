import * as z from "zod";
import { strArray, version } from "./utils.ts";

export const format = z.literal(["suffix", "full", "keyword", "regexp"]);

export const geositeFilter = z.object({
  v: version
    .optional()
    .default("2")
    .describe("version of sing-box rule-set"),

  f: z.union([format, format.array()])
    .optional()
    .default(["suffix", "full"])
    .transform((val) => Array.isArray(val) ? val : [val])
    .describe("domain's format"),

  t: strArray
    .describe("include tags"),
  et: strArray
    .optional()
    .describe("exclude tags"),

  d: strArray
    .optional()
    .describe("extra domain"),
  ds: strArray
    .optional()
    .describe("extra domain suffix"),
  dk: strArray
    .optional()
    .describe("extra domain keyword"),
  dr: strArray
    .optional()
    .describe("extra domain regex"),

  ed: strArray
    .optional()
    .describe("exclude domain"),
  eds: strArray
    .optional()
    .describe("exclude domain suffix"),
  edk: strArray
    .optional()
    .describe("exclude domain keyword"),
  edr: strArray
    .optional()
    .describe("exclude domain regex"),
});
