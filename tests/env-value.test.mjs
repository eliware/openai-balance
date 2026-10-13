import { describe, expect, test } from "@jest/globals";

import { unquoteEnvValue } from "../src/env-value.mjs";

describe("environment value parsing", () => {
  test.each([
    ['"hello world"', "hello world"],
    ["'hello world'", "hello world"],
    ['"open quote', '"open quote'],
    ["plain value", "plain value"],
  ])("removes matching quote pairs from %s", (value, expected) => {
    expect(unquoteEnvValue(value)).toBe(expected);
  });
});
