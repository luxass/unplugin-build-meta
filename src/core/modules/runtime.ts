import type { BuildMetaModule } from "../types";
import process from "node:process";

interface RuntimeInfo {
  platform: NodeJS.Platform;
  arch: NodeJS.Architecture;
  versions: NodeJS.ProcessVersions;
}

export const runtimeModule: BuildMetaModule = {
  name: "runtime",
  load: async () => {
    const runtime = {
      platform: process.platform,
      arch: process.arch,
      versions: process.versions,
    } satisfies RuntimeInfo;

    return [
      `export const platform = ${JSON.stringify(runtime.platform)}`,
      `export const arch = ${JSON.stringify(runtime.arch)}`,
      `export const versions = ${JSON.stringify(runtime.versions, null, 2)}`,
    ].join("\n");
  },
};
