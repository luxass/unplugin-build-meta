import type { BuildMetaModule } from "./core/types";

/**
 * Defines a build meta module.
 * This function serves as a type guard ensuring that the provided module adheres to the BuildMetaModule interface.
 *
 * @param {BuildMetaModule} module - The build meta module to define
 * @returns {BuildMetaModule} The same module, typed as a BuildMetaModule
 */
export function defineBuildMetaModule(module: BuildMetaModule): BuildMetaModule {
  return module;
}
