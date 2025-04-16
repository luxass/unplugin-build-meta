import { createFarmPlugin } from "unplugin";
import { unpluginFactory } from "./";

/**
 * Farm plugin
 *
 * @example
 * ```ts
 * // farm.config.ts
 * import buildMeta from "unplugin-build-meta/farm"
 *
 * export default defineConfig({
 *   plugins: [buildMeta()],
 * }
 * ```
 */
export default createFarmPlugin(unpluginFactory);
