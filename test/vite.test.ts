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
      plugins: [buildMeta()],
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

    const code = firstResult?.output[0].code;

    // check for git metadata exports and formats
    expect(code).toMatch(/repositoryUrl\s*[:=]\s*["']https:\/\/[^"']+["']/);
    expect(code).toMatch(/sha\s*[:=]\s*["'][a-f0-9]{40}["']/);
    expect(code).toMatch(/shortSha\s*[:=]\s*["'][a-f0-9]{10}["']/);
    expect(code).toMatch(/branch\s*[:=]\s*["'][^"']+["']/);
    expect(code).toMatch(/tags\s*[:=]\s*\[[^\]]*\]/);
    expect(code).toMatch(/commitAuthorName\s*[:=]\s*["'][^"']+["']/);
    expect(code).toMatch(/commitAuthorEmail\s*[:=]\s*["'][^@"']+@[^"']+["']/);
    expect(code).toMatch(/commitAuthorDate\s*[:=]\s*["']\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
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
      plugins: [buildMeta()],
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

    const code = firstResult?.output[0].code;

    // check that the selected properties were inlined or emitted into the bundle
    expect(code).toMatch(/branch\s*[:=]\s*["'][^"']+["']/);
    expect(code).toMatch(/sha\s*[:=]\s*["'][a-f0-9]{40}["']/);
    expect(code).toMatch(/shortSha\s*[:=]\s*["'][a-f0-9]{10}["']/);

    // verify the specific import use site is still present
    expect(code).toContain("console.log({");
  });
});

describe("handles runtime metadata", () => {
  it("expect runtime metadata to be available", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/runtime"));

    expect(testdirPath).toBeDefined();

    const result = await build({
      build: {
        lib: {
          entry: join(testdirPath, "runtime.js"),
          formats: ["es"],
          fileName: "bundle",
          name: "bundle",
        },
        outDir: join(testdirPath, "dist"),
        minify: false,
      },
      plugins: [buildMeta()],
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

    const code = firstResult?.output[0].code;

    // Vite/Rolldown may emit either direct assignments or getter-based namespace exports.
    expect(code).toMatch(/(?:platform\s*:\s*\(\)\s*=>\s*(?:platform|["'][^"']+["'])|(?:const|var)\s+platform\s*=\s*["'][^"']+["'])/);
    expect(code).toMatch(/(?:arch\s*:\s*\(\)\s*=>\s*(?:arch|["'][^"']+["'])|(?:const|var)\s+arch\s*=\s*["'][^"']+["'])/);
    expect(code).toMatch(/(?:versions\s*:\s*\(\)\s*=>\s*versions|(?:const|var)\s+versions\s*=\s*\{)/);
  });

  it("expect specific runtime properties to be importable", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/runtime"));

    expect(testdirPath).toBeDefined();

    const result = await build({
      build: {
        lib: {
          entry: join(testdirPath, "runtime-specific.js"),
          formats: ["es"],
          fileName: "bundle",
          name: "bundle",
        },
        outDir: join(testdirPath, "dist"),
        minify: false,
      },
      plugins: [buildMeta()],
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

    const code = firstResult?.output[0].code;

    // check that the selected properties were inlined or emitted into the bundle
    expect(code).toMatch(/platform\s*[:=]\s*["'][^"']+["']/);
    expect(code).toMatch(/arch\s*[:=]\s*["'][^"']+["']/);
    expect(code).toMatch(/versions\s*[:=]\s*\{/);

    // verify the specific import use site is still present
    expect(code).toContain("console.log({");
  });
});
