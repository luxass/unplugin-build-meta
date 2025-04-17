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
      plugins: [buildMeta()],
    });

    expect(result).toBeDefined();
    expect(result.outputFiles).toBeDefined();
    expect(result.outputFiles[0]).toBeDefined();

    const output = result.outputFiles[0]?.text;
    expect(output).toBeDefined();

    // check for git metadata exports and formats
    expect(output).toMatch(/var\s+repositoryUrl\s*=\s*["']https:\/\/[^"']+["']/);
    expect(output).toMatch(/var\s+sha\s*=\s*["'][a-f0-9]{40}["']/);
    expect(output).toMatch(/var\s+shortSha\s*=\s*["'][a-f0-9]{10}["']/);
    expect(output).toMatch(/var\s+branch\s*=\s*["'][^"']+["']/);
    expect(output).toMatch(/var\s+tags\s*=\s*\[\]/);
    expect(output).toMatch(/var\s+commitAuthorName\s*=\s*["'][^"']+["']/);
    expect(output).toMatch(/var\s+commitAuthorEmail\s*=\s*["'][^@"']+@[^"']+["']/);
    expect(output).toMatch(/var\s+commitAuthorDate\s*=\s*["']\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it("expect specific git properties to be importable", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/git"));
    expect(testdirPath).toBeDefined();

    const result = await build({
      entryPoints: [join(testdirPath, "git-specific.js")],
      bundle: true,
      write: false,
      format: "esm",
      plugins: [buildMeta()],
    });

    expect(result).toBeDefined();
    expect(result.outputFiles).toBeDefined();
    expect(result.outputFiles[0]).toBeDefined();

    const output = result.outputFiles[0]?.text;
    expect(output).toBeDefined();

    // check for variable declarations and their formats
    expect(output).toMatch(/var\s+branch\s*=\s*["'][^"']+["']/);
    expect(output).toMatch(/var\s+sha\s*=\s*["'][a-f0-9]{40}["']/);
    expect(output).toMatch(/var\s+shortSha\s*=\s*["'][a-f0-9]{10}["']/);

    // verify console.log with destructured properties
    expect(output).toContain("console.log({ branch, sha, shortSha })");
  });
});

describe("handles runtime metadata", () => {
  it("expect runtime metadata to be available", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/runtime"));
    expect(testdirPath).toBeDefined();

    const result = await build({
      entryPoints: [join(testdirPath, "runtime.js")],
      bundle: true,
      write: false,
      format: "esm",
      plugins: [buildMeta()],
    });

    expect(result).toBeDefined();
    expect(result.outputFiles).toBeDefined();
    expect(result.outputFiles[0]).toBeDefined();

    const output = result.outputFiles[0]?.text;
    expect(output).toBeDefined();

    // check for runtime metadata exports
    expect(output).toMatch(/var\s+platform\s*=\s*["'][^"']+["']/);
    expect(output).toMatch(/var\s+arch\s*=\s*["'][^"']+["']/);
    expect(output).toMatch(/var\s+versions\s*=\s*\{/);
  });

  it("expect specific runtime properties to be importable", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/runtime"));
    expect(testdirPath).toBeDefined();

    const result = await build({
      entryPoints: [join(testdirPath, "runtime-specific.js")],
      bundle: true,
      write: false,
      format: "esm",
      plugins: [buildMeta()],
    });

    expect(result).toBeDefined();
    expect(result.outputFiles).toBeDefined();
    expect(result.outputFiles[0]).toBeDefined();

    const output = result.outputFiles[0]?.text;
    expect(output).toBeDefined();

    // check for variable declarations and their formats
    expect(output).toMatch(/var\s+platform\s*=\s*["'][^"']+["']/);
    expect(output).toMatch(/var\s+arch\s*=\s*["'][^"']+["']/);
    expect(output).toMatch(/var\s+versions\s*=\s*\{/);

    // verify console.log with destructured properties
    expect(output).toContain("console.log({ platform, arch, versions })");
  });
});
