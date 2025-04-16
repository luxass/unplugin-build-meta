import { join } from "node:path";
import { build } from "esbuild";
import { describe, expect, it } from "vitest";
import { testdir } from "vitest-testdirs";
import buildMeta from "../src/esbuild";

describe("handles git metadata", () => {
  it("expect git metadata to be available", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/git"));

    expect(testdirPath).toBeDefined();

    const result = await build({
      entryPoints: [join(testdirPath, "git.js")],
      bundle: true,
      write: false,
      format: "esm",
      plugins: [buildMeta({
        modules: ["git"],
      })],
    });

    expect(result).toBeDefined();
    expect(result.outputFiles).toBeDefined();
    expect(result.outputFiles[0]).toBeDefined();
    expect(result.outputFiles[0]?.text).toBeDefined();
    expect(result.outputFiles[0]?.text).toMatchSnapshot();
  });

  it("expect specific git properties to be importable", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/git"));

    expect(testdirPath).toBeDefined();

    const result = await build({
      entryPoints: [join(testdirPath, "git-specific.js")],
      bundle: true,
      write: false,
      format: "esm",
      plugins: [buildMeta({
        modules: ["git"],
      })],
    });

    expect(result).toBeDefined();
    expect(result.outputFiles).toBeDefined();
    expect(result.outputFiles[0]).toBeDefined();
    expect(result.outputFiles[0]?.text).toBeDefined();
    expect(result.outputFiles[0]?.text).toMatchSnapshot();
  });
});
