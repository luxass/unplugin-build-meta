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

    // Check for git metadata exports and formats
    expect(code).toMatch(/const\s+repositoryUrl\s*=\s*["']https:\/\/[^"']+["']/);
    expect(code).toMatch(/const\s+sha\s*=\s*["'][a-f0-9]{40}["']/);
    expect(code).toMatch(/const\s+shortSha\s*=\s*["'][a-f0-9]{10}["']/);
    expect(code).toMatch(/const\s+branch\s*=\s*["'][^"']+["']/);
    expect(code).toMatch(/const\s+tags\s*=\s*\[\]/);
    expect(code).toMatch(/const\s+commitAuthorName\s*=\s*["'][^"']+["']/);
    expect(code).toMatch(/const\s+commitAuthorEmail\s*=\s*["'][^@"']+@[^"']+["']/);
    expect(code).toMatch(/const\s+commitAuthorDate\s*=\s*["']\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
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

    // Check for constant declarations and their formats
    expect(code).toMatch(/const\s+branch\s*=\s*["'][^"']+["']/);
    expect(code).toMatch(/const\s+sha\s*=\s*["'][a-f0-9]{40}["']/);
    expect(code).toMatch(/const\s+shortSha\s*=\s*["'][a-f0-9]{10}["']/);

    // Verify console.log with destructured properties
    expect(code).toContain("console.log({ branch, sha, shortSha })");
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

    // Check for runtime metadata exports
    expect(code).toMatch(/const\s+platform\s*=\s*["'][^"']+["']/);
    expect(code).toMatch(/const\s+arch\s*=\s*["'][^"']+["']/);
    expect(code).toMatch(/const\s+versions\s*=\s*\{/);
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

    // Check for specific runtime property exports
    expect(code).toMatch(/const\s+platform\s*=\s*["'][^"']+["']/);
    expect(code).toMatch(/const\s+arch\s*=\s*["'][^"']+["']/);
    expect(code).toMatch(/const\s+versions\s*=\s*\{/);

    // Verify console.log with destructured properties
    expect(code).toContain("console.log({ platform, arch, versions })");
  });
});
