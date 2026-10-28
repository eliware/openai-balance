import { describe, expect, test } from "@jest/globals";

import { isValidEnvKey } from "../../src/env/key.mjs";

describe("environment key validation", () => {
  test.each(["A", "_PRIVATE", "value2"])("accepts key %s", (key) => {
    expect(isValidEnvKey(key)).toBe(true);
  });

  test.each(["", "2VALUE", "BAD-KEY", "HAS SPACE"])("rejects key %s", (key) => {
    expect(isValidEnvKey(key)).toBe(false);
  });
});
