import { createEsbuildPlugin } from "unplugin";
import { unpluginFactory } from "./";

/**
 * Esbuild plugin
 *
 * @example
 * ```ts
 * // esbuild.config.js
 * import { build } from "esbuild";
 *
 * build({
 *   plugins: [require("unplugin-build-meta/esbuild")()],
 * })
 * ```
 */
export default createEsbuildPlugin(unpluginFactory);
