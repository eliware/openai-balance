import { describe, expect, jest, test } from "@jest/globals";

import { loadPackageVersion } from "../../src/version/loader.mjs";

describe("package version loader", () => {
  const readFile = jest.fn(async () => '{"version":"15.0.1"}');
  test.each([
    ["default dependencies", undefined],
    ["an injected reader", { scriptDir: "package-root", readFile }],
  ])("loads the package version with %s", async (dependencyName, options) => {
    await expect(loadPackageVersion(options)).resolves.toBe("15.0.1");

    if (dependencyName === "an injected reader") {
      expect(readFile).toHaveBeenCalledWith(expect.stringContaining("package.json"), "utf8");
    }
  });

  test("rejects package data without a version", async () => {
    await expect(
      loadPackageVersion({
        scriptDir: "package-root",
        readFile: async () => "{}",
      }),
    ).rejects.toThrow("missing package version");
  });
});
