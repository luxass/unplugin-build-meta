import { join } from "node:path";
import { rollup } from "rollup";
import { describe, expect, it } from "vitest";
import { testdir } from "vitest-testdirs";
import buildMeta from "../src/rollup";

describe("handles git metadata", () => {
  it("expect git metadata to be available", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/git"));

    expect(testdirPath).toBeDefined();

    const bundle = await rollup({
      input: join(testdirPath, "git.js"),
      plugins: [buildMeta()],
    });

    const { output } = await bundle.generate({
      format: "es",
    });

    expect(output).toBeDefined();
    expect(output[0]).toBeDefined();
    expect(output[0].code).toBeDefined();

    const code = output[0].code;

    // check for git metadata exports and formats
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

    const bundle = await rollup({
      input: join(testdirPath, "git-specific.js"),
      plugins: [buildMeta()],
    });

    const { output } = await bundle.generate({
      format: "es",
    });

    expect(output).toBeDefined();
    expect(output[0]).toBeDefined();
    expect(output[0].code).toBeDefined();

    const code = output[0].code;

    // check for constant declarations and their formats
    expect(code).toMatch(/const\s+branch\s*=\s*["'][^"']+["']/);
    expect(code).toMatch(/const\s+sha\s*=\s*["'][a-f0-9]{40}["']/);
    expect(code).toMatch(/const\s+shortSha\s*=\s*["'][a-f0-9]{10}["']/);

    // verify console.log with destructured properties
    expect(code).toContain("console.log({ branch, sha, shortSha })");
  });
});

describe("handles runtime metadata", () => {
  it("expect runtime metadata to be available", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/runtime"));

    expect(testdirPath).toBeDefined();

    const bundle = await rollup({
      input: join(testdirPath, "runtime.js"),
      plugins: [buildMeta()],
    });

    const { output } = await bundle.generate({
      format: "es",
    });

    expect(output).toBeDefined();
    expect(output[0]).toBeDefined();
    expect(output[0].code).toBeDefined();

    const code = output[0].code;

    // check for runtime metadata exports
    expect(code).toMatch(/const\s+platform\s*=\s*["'][^"']+["']/);
    expect(code).toMatch(/const\s+arch\s*=\s*["'][^"']+["']/);
    expect(code).toMatch(/const\s+versions\s*=\s*\{/);
  });

  it("expect specific runtime properties to be importable", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/runtime"));

    expect(testdirPath).toBeDefined();

    const bundle = await rollup({
      input: join(testdirPath, "runtime-specific.js"),
      plugins: [buildMeta()],
    });

    const { output } = await bundle.generate({
      format: "es",
    });

    expect(output).toBeDefined();
    expect(output[0]).toBeDefined();
    expect(output[0].code).toBeDefined();

    const code = output[0].code;

    // check for specific runtime property exports
    expect(code).toMatch(/const\s+platform\s*=\s*["'][^"']+["']/);
    expect(code).toMatch(/const\s+arch\s*=\s*["'][^"']+["']/);
    expect(code).toMatch(/const\s+versions\s*=\s*\{/);

    // verify console.log with destructured properties
    expect(code).toContain("console.log({ platform, arch, versions })");
  });
});
