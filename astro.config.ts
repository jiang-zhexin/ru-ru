import cloudflare from "@astrojs/cloudflare";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  adapter: cloudflare({ imageService: "passthrough" }),
  session: false,
  integrations: [svelte()],
  vite: {
    build: { minify: false },
    plugins: [tailwindcss()],
  },
});
