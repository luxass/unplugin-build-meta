import type { UnpluginFactory, UnpluginInstance } from "unplugin";
import type { BuildMetaModule, BuildMetaOptions } from "./types";
import { createUnplugin } from "unplugin";
import { PLUGIN_NAME } from "./constants";
import gitModule from "./modules/git";

export type { BuildMetaOptions };

/**
 * A unplugin factory, used by Unplugin to create a new plugin instance.
 */
export const unpluginFactory: UnpluginFactory<BuildMetaOptions | undefined> = (options = {}) => {
  const { modules: _modules = [] } = options;

  const modules: BuildMetaModule[] = [];

  for (const module of _modules) {
    if (typeof module === "object" && "name" in module) {
      modules.push(module);
      continue;
    }

    if (module === "git") {
      modules.push(gitModule);
    }
  }

  return {
    name: PLUGIN_NAME,
    enforce: "pre",
    resolveId(id) {
      if (!id.startsWith("build-meta:")) return;
      if (!modules.map((m) => m.name).includes(id.slice(11))) {
        return;
      }

      return `\0${id}`;
    },
    loadInclude(id) {
      if (!id.startsWith("\0")) return false;
      return modules.map((m) => m.name).includes(id.slice(12));
    },
    async load(id) {
      if (!id.startsWith("\0")) return;
      id = id.slice(12);

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
