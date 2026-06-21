import type { version } from "@/validator/utils.ts";
import * as z from "zod";

export type StringToNumber<T extends string> = T extends
  `${infer N extends number}` ? N
  : never;

export type Version = z.input<typeof version>;
