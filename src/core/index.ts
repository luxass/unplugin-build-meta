import type { UnpluginFactory, UnpluginInstance } from "unplugin";
import type { BuildMetaModule, BuildMetaOptions } from "./types";
import { createUnplugin } from "unplugin";
import { PLUGIN_NAME } from "./constants";
import gitModule from "./modules/git";
import { runtimeModule } from "./modules/runtime";

export type { BuildMetaOptions };

const PREFIX = "virtual:build-meta/";
const PREFIX_WITH_NULL = `\0${PREFIX}`;

/**
 * A unplugin factory, used by Unplugin to create a new plugin instance.
 */
export const unpluginFactory: UnpluginFactory<BuildMetaOptions | undefined> = (options = {}) => {
  const { git = true, extraModules = [], runtime = true } = options;

  const modules: BuildMetaModule[] = [];

  if (git) {
    modules.push(gitModule);
  }

  if (runtime) {
    modules.push(runtimeModule);
  }

  // Add any extra custom modules
  modules.push(...extraModules);

  return {
    name: PLUGIN_NAME,
    enforce: "pre",
    resolveId(id) {
      if (!id.startsWith(PREFIX)) return;
      id = id.slice(PREFIX.length);
      if (!modules.map((m) => m.name).includes(id)) {
        return;
      }

      return `${PREFIX_WITH_NULL}${id}`;
    },
    loadInclude(id) {
      if (!id.startsWith(PREFIX_WITH_NULL)) return false;
      return modules.map((m) => m.name).includes(id.slice(PREFIX_WITH_NULL.length));
    },
    async load(id) {
      if (!id.startsWith(PREFIX_WITH_NULL)) return;
      id = id.slice(PREFIX_WITH_NULL.length);

      for (const mod of Object.values(modules)) {
        if (id === mod.name) {
          return mod.load(this, id);
        }
      }
    },
  };
};

/**
 * The main unplugin instance.
 */
export const unplugin: UnpluginInstance<BuildMetaOptions | undefined, boolean> = /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;
