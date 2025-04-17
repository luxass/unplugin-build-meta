import type { Configuration, Stats } from "webpack";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { testdir } from "vitest-testdirs";
import { webpack as createWebpack } from "webpack";
import buildMeta from "../src/webpack";

interface WebpackResult {
  stats: Stats;
  json: ReturnType<Stats["toJson"]>;
  file: string;
}

async function webpack(config: Configuration, testdirPath: string): Promise<WebpackResult> {
  return new Promise((resolve, reject) => {
    const compiler = createWebpack({
      optimization: {
        minimize: true,
      },
      output: {
        path: join(testdirPath, "dist"),
        filename: "bundle.js",
        libraryTarget: "module",
      },
      mode: "none",
      target: ["es2020"],
      experiments: {
        outputModule: true,
      },
      ...config,
    });

    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      }

      if (!stats) {
        reject(new Error("webpack stats not available"));
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

    const { stats } = await webpack({
      entry: join(testdirPath, "git.js"),
      plugins: [
        buildMeta(),
      ],
    }, testdirPath);

    const output = stats.toJson({ source: true }).modules?.[0]?.source;

    expect(output).toBeDefined();

    // Verify import format for all git metadata
    expect(output).toMatch(/import\s*\*\s*as\s+git\s+from\s*["']virtual:build-meta\/git["']/);
    expect(output).toContain("console.log(git)");
  });

  it("expect specific git properties to be importable", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/git"));
    expect(testdirPath).toBeDefined();

    const { stats } = await webpack({
      entry: join(testdirPath, "git-specific.js"),
      plugins: [
        buildMeta(),
      ],
    }, testdirPath);

    const output = stats.toJson({ source: true }).modules?.[0]?.source;

    expect(output).toBeDefined();

    // Verify named imports format
    expect(output).toMatch(/import\s*\{\s*branch,\s*sha,\s*shortSha\s*\}\s*from\s*["']virtual:build-meta\/git["']/);

    // Verify console.log with destructured properties
    expect(output).toContain("console.log({ branch, sha, shortSha })");
  });
});

describe("handles runtime metadata", () => {
  it("expect runtime metadata to be available", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/runtime"));
    expect(testdirPath).toBeDefined();

    const { stats } = await webpack({
      entry: join(testdirPath, "runtime.js"),
      plugins: [
        buildMeta(),
      ],
    }, testdirPath);

    const output = stats.toJson({ source: true }).modules?.[0]?.source;
    expect(output).toBeDefined();

    // Verify import format for all runtime metadata
    expect(output).toMatch(/import\s*\*\s*as\s+runtime\s+from\s*["']virtual:build-meta\/runtime["']/);
    expect(output).toContain("console.log(runtime)");
  });

  it("expect specific runtime properties to be importable", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/runtime"));
    expect(testdirPath).toBeDefined();

    const { stats } = await webpack({
      entry: join(testdirPath, "runtime-specific.js"),
      plugins: [
        buildMeta(),
      ],
    }, testdirPath);

    const output = stats.toJson({ source: true }).modules?.[0]?.source;
    expect(output).toBeDefined();

    // Verify named imports format (order-independent)
    expect(output).toMatch(/import\s*\{\s*(?:[a-z]+,\s*){2}[a-z]+\s*\}\s*from\s*["']virtual:build-meta\/runtime["']/);

    // Verify console.log with destructured properties
    expect(output).toContain("console.log({ platform, arch, versions })");
  });
});
