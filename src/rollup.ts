import { createRollupPlugin } from "unplugin";
import { unpluginFactory } from "./";

/**
 * Rollup plugin
 *
 * @example
 * ```ts
 * // rollup.config.js
 * import buildMeta from "unplugin-build-meta/rollup"
 *
 * export default {
 *   plugins: [buildMeta()],
 * }
 * ```
 */
export default createRollupPlugin(unpluginFactory);
