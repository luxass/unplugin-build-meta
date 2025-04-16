import { createRolldownPlugin } from "unplugin";
import { unpluginFactory } from "./";

/**
 * Rolldown plugin
 *
 * @example
 * ```ts
 * // rolldown.config.js
 * import buildMeta from "unplugin-build-meta/rolldown"
 *
 * export default {
 *   plugins: [buildMeta()],
 * }
 * ```
 */
export default createRolldownPlugin(unpluginFactory);
