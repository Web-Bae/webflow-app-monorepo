import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import wfReload from "@xatom/wf-app-hot-reload";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 1337,
    watch: {
      usePolling: true,
    },
  },
  plugins: [svelte(), wfReload()],
  base: "./",
});
