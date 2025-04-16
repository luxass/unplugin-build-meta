import react from "@vitejs/plugin-react";
import buildMeta from "unplugin-build-meta/vite";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), buildMeta({
    modules: [
      "git",
    ],
  })],
});
