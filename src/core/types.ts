import type { UnpluginBuildContext, UnpluginContext } from "unplugin";

export type Module = "git";

export interface BuildMetaModule {
  name: string;
  load: (ctx: UnpluginBuildContext & UnpluginContext, id: string) => Promise<string>;
}

export interface BuildMetaOptions {
  /**
   * Whether to enable the git module.
   * @default true
   */
  git?: boolean;

  /**
   * Whether to enable the runtime module.
   * @default true
   */
  runtime?: boolean;

  /**
   * Additional custom modules to include in the build meta.
   */
  extraModules?: BuildMetaModule[];
}
