import { describe, expect, test } from "@jest/globals";
import fs from "node:fs/promises";
import path from "node:path";

import { loadPackageVersion } from "../src/version-loader.mjs";
import { readPackageVersion, withTempDir } from "../test-fixtures/helpers.mjs";

describe("package version loader", () => {
  test("loads the package version", async () => {
    await expect(loadPackageVersion()).resolves.toBe(await readPackageVersion());
  });

  test("rejects package data without a version", async () => {
    await withTempDir("openai-balance-", async (scriptDir) => {
      await fs.writeFile(path.join(scriptDir, "package.json"), "{}");
      await expect(loadPackageVersion({ scriptDir })).rejects.toThrow("missing package version");
    });
  });
});
