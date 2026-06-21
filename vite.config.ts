import { cloudflare } from "@cloudflare/vite-plugin";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    svelte(),
    cloudflare(),
  ],
  resolve: { tsconfigPaths: true },
  server: { port: 8787 },
});
