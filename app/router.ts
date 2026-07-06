import { createRouter } from "sv-router";
import Geoip from "./routes/Geoip.svelte";
import Geosite from "./routes/Geosite.svelte";
import Home from "./routes/Home.svelte";

export const { p, navigate, isActive, route } = createRouter({
  "/": Home,
  "/geosite": Geosite,
  "/geoip": Geoip,
});
