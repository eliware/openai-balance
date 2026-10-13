import { describe, expect, test } from "@jest/globals";

import * as api from "../src/index.mjs";

describe("public exports", () => {
  test("exports the supported CLI and helper functions", () => {
    expect(Object.keys(api).sort()).toEqual([
      "cli",
      "extractBalance",
      "fail",
      "formatBalance",
      "formatCombinedBalance",
      "formatHelp",
      "formatNanoDollars",
      "formatSummary",
      "getConfigValue",
      "loadConfigEnvFile",
      "loadEnvFile",
      "loadPackageVersion",
      "main",
      "parseCliArgs",
      "projectRoot",
      "srcDir",
      "toRealFileUrl",
    ]);
  });
});
