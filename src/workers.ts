import { handle } from "@astrojs/cloudflare/handler";

export { SyncGeoSite } from "@/workflows/geosite.ts";
export { SyncGeoIP } from "@/workflows/geoip.ts";

export default {
  fetch(request, env, ctx) {
    return handle(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;
