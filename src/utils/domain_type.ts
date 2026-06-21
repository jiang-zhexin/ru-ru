import { Domain_Type } from "@/gen/geosite_pb.ts";
import type { Format } from "@/types/geosite.ts";

export function domain_type_to_str(e: Domain_Type): Format {
  switch (e) {
    case Domain_Type.Full:
      return "full";
    case Domain_Type.RootDomain:
      return "suffix";
    case Domain_Type.Plain:
      return "keyword";
    case Domain_Type.Regex:
      return "regexp";
  }
}
