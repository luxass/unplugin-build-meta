import type { NuxtModule } from "@nuxt/schema";
import type { BuildMetaOptions } from "./";
import { addVitePlugin, addWebpackPlugin, defineNuxtModule } from "@nuxt/kit";
import { NUXT_CONFIG_KEY, PLUGIN_NAME } from "./core/constants";
import vite from "./vite";
import webpack from "./webpack";

/**
 * Nuxt plugin
 *
 * @example
 * ```ts
 * // nuxt.config.ts
 * import buildMeta from "unplugin-build-meta/nuxt"
 *
 * export default defineNuxtConfig({
 *   plugins: [buildMeta()],
 * })
 * ```
 */
export default defineNuxtModule<BuildMetaOptions>({
  meta: {
    name: PLUGIN_NAME,
    configKey: NUXT_CONFIG_KEY,
  },
  setup(options, nuxt) {
    nuxt.options.typescript.tsConfig ||= {};
    nuxt.options.typescript.tsConfig.compilerOptions ||= {};
    nuxt.options.typescript.tsConfig.compilerOptions.types ||= [];
    nuxt.options.typescript.tsConfig.compilerOptions.types.push("unplugin-build-meta/types");

    addWebpackPlugin(() => webpack(options));
    addVitePlugin(() => vite(options));
  },
}) as NuxtModule<BuildMetaOptions>;
