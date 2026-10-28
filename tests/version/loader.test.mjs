import { describe, expect, test } from "@jest/globals";

import { loadPackageVersion } from "../../src/version/loader.mjs";

describe("package version loader", () => {
  test("loads the package version through default dependencies", async () => {
    await expect(loadPackageVersion()).resolves.toBe("15.0.1");
  });

  test("loads the package version", async () => {
    const readFile = async (filePath, encoding) => {
      expect(filePath).toContain("package.json");
      expect(encoding).toBe("utf8");
      return '{"version":"15.0.1"}';
    };
    await expect(loadPackageVersion({ scriptDir: "package-root", readFile })).resolves.toBe(
      "15.0.1",
    );
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
