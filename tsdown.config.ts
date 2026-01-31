import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/*.ts"],
  format: ["cjs", "esm"],
  clean: true,
  dts: true,
  treeshake: true,
  publint: true,
  exports: {
    enabled: "local-only",
    customExports(exports) {
      exports["./types"] = {
        types: "./types/index.d.ts",
      };
      exports["./types/*"] = {
        types: "./types/*.d.ts",
      };
      exports["./package.json"] = "./package.json";
      return exports;
    },
    packageJson: false,
  },
  outputOptions: {
    exports: "named",
  },
});
