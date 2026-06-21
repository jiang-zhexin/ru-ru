import * as z from "zod";

export const version = z.literal(["1", "2", "3", "4", "5"]);

export const strArray = z.union([z.string(), z.string().array()])
  .transform((val) => (Array.isArray(val) ? val : [val]));
