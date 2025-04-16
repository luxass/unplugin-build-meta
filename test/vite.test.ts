import { join } from "node:path";
import { build } from "vite";
import { describe, expect, it } from "vitest";
import { testdir } from "vitest-testdirs";
import buildMeta from "../src/vite";

describe("handles git metadata", () => {
  it("expect git metadata to be available", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/git"));

    expect(testdirPath).toBeDefined();

    const result = await build({
      build: {
        lib: {
          entry: join(testdirPath, "git.js"),
          formats: ["es"],
          fileName: "bundle",
          name: "bundle",
        },
        outDir: join(testdirPath, "dist"),
        minify: false,
      },
      plugins: [buildMeta({
        modules: ["git"],
      })],
    });

    if (!Array.isArray(result)) {
      expect.fail("result is not an array");
    }

    expect(result).toBeDefined();

    const firstResult = result[0];

    expect(firstResult).toBeDefined();
    expect(firstResult?.output).toBeDefined();
    expect(firstResult?.output[0]).toBeDefined();
    expect(firstResult?.output[0].code).toBeDefined();
    expect(firstResult?.output[0].code).toMatchSnapshot();
  });

  it("expect specific git properties to be importable", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/git"));

    expect(testdirPath).toBeDefined();

    const result = await build({
      build: {
        lib: {
          entry: join(testdirPath, "git-specific.js"),
          formats: ["es"],
          fileName: "bundle",
          name: "bundle",
        },
        outDir: join(testdirPath, "dist"),
        minify: false,
      },
      plugins: [buildMeta({
        modules: ["git"],
      })],
    });

    if (!Array.isArray(result)) {
      expect.fail("result is not an array");
    }

    expect(result).toBeDefined();

    const firstResult = result[0];

    expect(firstResult).toBeDefined();
    expect(firstResult?.output).toBeDefined();
    expect(firstResult?.output[0]).toBeDefined();
    expect(firstResult?.output[0].code).toBeDefined();
    expect(firstResult?.output[0].code).toMatchSnapshot();
  });
});
