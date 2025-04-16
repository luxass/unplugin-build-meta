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

    // Check for git metadata exports and formats
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

    // Check for variable declarations and their formats
    expect(output).toMatch(/var\s+branch\s*=\s*["'][^"']+["']/);
    expect(output).toMatch(/var\s+sha\s*=\s*["'][a-f0-9]{40}["']/);
    expect(output).toMatch(/var\s+shortSha\s*=\s*["'][a-f0-9]{10}["']/);

    // Verify console.log with destructured properties
    expect(output).toContain("console.log({ branch, sha, shortSha })");
  });
});
