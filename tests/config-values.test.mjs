import { describe, expect, test } from "@jest/globals";
import process from "node:process";

import { getConfigValue } from "../src/config-values.mjs";

describe("configuration value lookup", () => {
  test("prefers process values and falls back to file values", () => {
    expect(getConfigValue("ENDPOINT", { ENDPOINT: "file" }, { ENDPOINT: "process" })).toBe(
      "process",
    );
    expect(getConfigValue("ENDPOINT", { ENDPOINT: "file" }, {})).toBe("file");
  });

  test("uses process.env by default", () => {
    const previous = process.env.TEST_BALANCE_CONFIG_VALUE;
    process.env.TEST_BALANCE_CONFIG_VALUE = "process";
    try {
      expect(
        getConfigValue("TEST_BALANCE_CONFIG_VALUE", { TEST_BALANCE_CONFIG_VALUE: "file" }),
      ).toBe("process");
    } finally {
      if (previous === undefined) delete process.env.TEST_BALANCE_CONFIG_VALUE;
      else process.env.TEST_BALANCE_CONFIG_VALUE = previous;
    }
  });
});
