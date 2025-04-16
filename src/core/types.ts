import type { UnpluginBuildContext, UnpluginContext } from "unplugin";

export type Module = "git";

export interface BuildMetaModule {
  name: string;
  load: (ctx: UnpluginBuildContext & UnpluginContext, id: string) => Promise<string>;
}

export interface BuildMetaOptions {
  /**
   * Which modules to include in the build meta.
   * By default `all` modules are included.
   */
  modules?: (Module | BuildMetaModule)[];
}
