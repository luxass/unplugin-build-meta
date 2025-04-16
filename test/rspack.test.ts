import type { Configuration, Stats } from "@rspack/core";
import { join } from "node:path";
import { rspack as createRspack } from "@rspack/core";
import { assert, describe, expect, it } from "vitest";
import { testdir } from "vitest-testdirs";
import buildMeta from "../src/rspack";

interface RspackResult {
  stats: Stats;
  json: ReturnType<Stats["toJson"]>;
  file: string;
}

async function rspack(config: Configuration, testdirPath: string): Promise<RspackResult> {
  return new Promise((resolve, reject) => {
    const compiler = createRspack({
      mode: "none",
      optimization: {
        minimize: false,
      },
      output: {
        path: join(testdirPath, "dist"),
        filename: "bundle.js",
        libraryTarget: "module",
      },
      target: ["es2020"],
      experiments: {
        outputModule: true,
        rspackFuture: {
          bundlerInfo: {
            force: false,
          },
        },
      },
      ...config,
    });

    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      }

      if (!stats) {
        reject(new Error("rspack stats not available"));
        return;
      }

      const json = stats.toJson();
      const files = json.assetsByChunkName?.main;
      if (!files || !Array.isArray(files) || files[0] == null) {
        reject(new Error("main chunk not found"));
        return;
      }

      const file = files[0];

      resolve({ stats, json, file });
    });
  });
}

describe("handles git metadata", () => {
  it("expect git metadata to be available", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/git"));
    expect(testdirPath).toBeDefined();

    const { stats } = await rspack({
      entry: join(testdirPath, "git.js"),
      plugins: [buildMeta({
        modules: ["git"],
      })],
    }, testdirPath);

    assert(stats, "stats should be defined");
    const output = stats.toJson({ source: true }).modules?.[0]?.source;
    expect(output).toBeDefined();
    expect(output).toMatchSnapshot();
  });

  it("expect specific git properties to be importable", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/git"));
    expect(testdirPath).toBeDefined();

    const { stats } = await rspack({
      entry: join(testdirPath, "git-specific.js"),
      plugins: [buildMeta({
        modules: ["git"],
      })],
    }, testdirPath);

    const output = stats.toJson({ source: true }).modules?.[0]?.source;
    expect(output).toBeDefined();
    expect(output).toMatchSnapshot();
  });
});
