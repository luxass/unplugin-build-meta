import { join } from "node:path";
import { rolldown } from "rolldown";
import { describe, expect, it } from "vitest";
import { testdir } from "vitest-testdirs";
import buildMeta from "../src/rolldown";

describe("handles git metadata", () => {
  it("expect git metadata to be available", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/git"));

    expect(testdirPath).toBeDefined();

    const bundle = await rolldown({
      input: join(testdirPath, "git.js"),
      plugins: [buildMeta({
        modules: ["git"],
      })],
    });

    const { output } = await bundle.generate({
      format: "esm",
    });

    expect(output).toBeDefined();
    expect(output[0]).toBeDefined();
    expect(output[0].code).toBeDefined();
    expect(output[0].code).toMatchSnapshot();
  });

  it("expect specific git properties to be importable", async () => {
    const testdirPath = await testdir.from(join(import.meta.dirname, "fixtures/git"));

    expect(testdirPath).toBeDefined();

    const bundle = await rolldown({
      input: join(testdirPath, "git-specific.js"),
      plugins: [buildMeta({
        modules: ["git"],
      })],
    });

    const { output } = await bundle.generate({
      format: "esm",
    });

    expect(output).toBeDefined();
    expect(output[0]).toBeDefined();
    expect(output[0].code).toBeDefined();
    expect(output[0].code).toMatchSnapshot();
  });
});
