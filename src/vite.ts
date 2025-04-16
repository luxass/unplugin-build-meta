import { createVitePlugin } from "unplugin";
import { unpluginFactory } from "./";

/**
 * Vite plugin
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import buildMeta from "unplugin-build-meta/vite"
 *
 * export default defineConfig({
 *   plugins: [buildMeta()],
 * })
 * ```
 */
export default createVitePlugin(unpluginFactory);
