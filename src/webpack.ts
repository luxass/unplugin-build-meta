import { createWebpackPlugin } from "unplugin";
import { unpluginFactory } from "./";

/**
 * Webpack plugin
 *
 * @example
 * ```ts
 * // webpack.config.js
 * module.exports = {
 *  plugins: [require("unplugin-build-meta/webpack")()],
 * }
 * ```
 */
export default createWebpackPlugin(unpluginFactory);
