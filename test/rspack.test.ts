import { createRequire } from "node:module";
import { join } from "node:path";

import type { Configuration } from "@rspack/core";
import { rspack as createRspack } from "@rspack/core";
import { describe, expect, it } from "vitest";
import { testdir } from "vitest-testdirs";

import buildMeta from "../src/rspack";

const require = createRequire(import.meta.url);
const { version: rspackVersion } = require("@rspack/core/package.json") as { version: string };
const rspackMajor = Number(rspackVersion.split(".")[0]);

async function rspack(config: Configuration, testdirPath: string): Promise<null> {
  return new Promise((resolve, reject) => {
    const compiler = createRspack({
      mode: "none",
      optimization: {
        minimize: false,
      },
      output: {
        path: join(testdirPath, "dist"),
        filename: "bundle.js",
        library: {
          type: "module",
        },
        module: true,
        // bundlerInfo was promoted from experiments to output in v2.x
        ...(rspackMajor >= 2 ? { bundlerInfo: { force: false } } : {}),
      },
      // In v1.x, bundlerInfo lived under experiments.rspackFuture
      ...(rspackMajor < 2
        ? ({ experiments: { rspackFuture: { bundlerInfo: { force: false } } } } as object)
        : {}),
      target: ["es2020"],
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

      if (stats.hasErrors()) {
        reject(new Error(stats.toString("errors-only")));
        return;
      }

      resolve(null);
    });
  });
}

describe("handles git metadata", () => {
  it("expect git metadata to be available", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/git"));
    expect(testdirPath).toBeDefined();

    await rspack(
      {
        entry: join(testdirPath, "git.js"),
        plugins: [buildMeta()],
      },
      testdirPath,
    );

    const { git } = await import(join(testdirPath, "dist/bundle.js"));
    expect(git).toBeDefined();
    expect(git).toHaveProperty("branch");
    expect(git).toHaveProperty("sha");
    expect(git).toHaveProperty("shortSha");
    expect(git).toHaveProperty("repositoryUrl");
  });

  it("expect specific git properties to be importable", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/git"));
    expect(testdirPath).toBeDefined();

    await rspack(
      {
        entry: join(testdirPath, "git-specific.js"),
        plugins: [buildMeta()],
      },
      testdirPath,
    );

    const module = await import(join(testdirPath, "dist/bundle.js"));
    expect(module.branch).toBeDefined();
    expect(module.sha).toBeDefined();
    expect(module.shortSha).toBeDefined();
  });
});

describe("handles runtime metadata", () => {
  it("expect runtime metadata to be available", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/runtime"));
    expect(testdirPath).toBeDefined();

    await rspack(
      {
        entry: join(testdirPath, "runtime.js"),
        plugins: [buildMeta()],
      },
      testdirPath,
    );

    const { runtime } = await import(join(testdirPath, "dist/bundle.js"));
    expect(runtime).toBeDefined();
    expect(runtime).toHaveProperty("platform");
    expect(runtime).toHaveProperty("arch");
    expect(runtime).toHaveProperty("versions");
  });

  it("expect specific runtime properties to be importable", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/runtime"));
    expect(testdirPath).toBeDefined();

    await rspack(
      {
        entry: join(testdirPath, "runtime-specific.js"),
        plugins: [buildMeta()],
      },
      testdirPath,
    );

    const module = await import(join(testdirPath, "dist/bundle.js"));
    expect(module.platform).toBeDefined();
    expect(module.arch).toBeDefined();
    expect(module.versions).toBeDefined();
  });
});
