import type { AstroIntegration } from "astro";
import type { BuildMetaOptions } from "./core/types";
import { unplugin } from "./";
import { PLUGIN_NAME } from "./core/constants";

/**
 * Astro integration
 *
 * @example
 * ```ts
 * // astro.config.mjs
 * import buildMeta from "unplugin-build-meta/astro"
 *
 * export default defineConfig({
 *   integrations: [buildMeta()],
 * })
 * ```
 */
export default function BuildMetaIntegration(options: BuildMetaOptions): AstroIntegration {
  return {
    name: PLUGIN_NAME,
    hooks: {
      "astro:config:setup": async (astro: any) => {
        astro.config.vite.plugins ||= [];
        astro.config.vite.plugins.push(unplugin.vite(options));
      },
    },
  };
}
