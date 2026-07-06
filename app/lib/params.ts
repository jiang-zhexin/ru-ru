import type {
  GeositeFilterParams,
  GeositeFilterParamsInput,
} from "@/types/geosite.ts";
import { cloneDeep } from "es-toolkit/object";
import { isEqual } from "es-toolkit/predicate";

type ExtraParams = {
  name: string;
  format: "json" | "srs";
};

export type Params = GeositeFilterParams & ExtraParams;

export const DEFAULT_PARAMS: Params = {
  v: "2",
  f: ["suffix", "full"],
  t: [],
  et: [],
  d: [],
  ds: [],
  dk: [],
  dr: [],
  ed: [],
  eds: [],
  edk: [],
  edr: [],
  format: "srs",
  name: "geosite_draft",
};

export function filterParams(p: Params): GeositeFilterParamsInput {
  const { format: _format, name: _name, ...r } = cloneDeep(p) as
    & GeositeFilterParamsInput
    & ExtraParams;

  if (r.v === DEFAULT_PARAMS.v) delete r.v;
  if (isEqual(new Set(r.f), new Set(DEFAULT_PARAMS.f))) delete r.f;

  return r;
}
