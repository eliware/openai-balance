import { describe, expect, test } from "@jest/globals";

import { getConfigValue } from "../../src/config/values.mjs";

describe("configuration value lookup", () => {
  test("prefers process values and falls back to file values", () => {
    expect(getConfigValue("ENDPOINT", { ENDPOINT: "file" }, { ENDPOINT: "process" })).toBe(
      "process",
    );
    expect(getConfigValue("ENDPOINT", { ENDPOINT: "file" }, {})).toBe("file");
  });

  test("uses an injected process environment", () => {
    expect(
      getConfigValue(
        "TEST_BALANCE_CONFIG_VALUE",
        { TEST_BALANCE_CONFIG_VALUE: "file" },
        { TEST_BALANCE_CONFIG_VALUE: "process" },
      ),
    ).toBe("process");
  });

  test("uses the default process environment", () => {
    expect(getConfigValue("PATH", { PATH: "file" })).toBe(process.env.PATH);
  });
});
