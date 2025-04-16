/**
 * This entry file is for Rspack plugin.
 *
 * @module
 */

import { createRspackPlugin } from "unplugin";
import { unpluginFactory } from "./";
/**
 * Rspack plugin
 *
 * @example
 * ```ts
 * // rspack.config.ts
 * import buildMeta from "unplugin-build-meta/rspack"
 *
 * export default defineConfig({
 *   plugins: [buildMeta()],
 * })
 * ```
 */
export default createRspackPlugin(unpluginFactory);
