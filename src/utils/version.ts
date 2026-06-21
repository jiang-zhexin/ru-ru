import type { StringToNumber } from "../types/utils.ts";

export function convertVersion<T extends string>(
  version: T,
): StringToNumber<T> {
  const num = Number(version);

  if (isNaN(num)) {
    throw new Error(`Cannot convert "${version}" to a valid number.`);
  }

  return num as StringToNumber<T>;
}
