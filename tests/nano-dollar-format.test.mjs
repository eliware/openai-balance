import { describe, expect, test } from "@jest/globals";

import { formatNanoValue } from "../src/nano-dollar-format.mjs";

describe("nano-dollar formatter", () => {
  test.each([
    [2.5, "2,500,000,000n"],
    [1.2345678906, "1,234,567,891n"],
    [0, "0n"],
  ])("formats %s nano-dollars", (amount, expected) => {
    expect(formatNanoValue(amount)).toBe(expected);
  });
});
