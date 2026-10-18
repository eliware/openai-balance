import { describe, expect, test } from "@jest/globals";

import { toNanoDollars } from "../../src/nano-dollar/value.mjs";

describe("nano-dollar conversion", () => {
  test.each([
    [2.5, 2_500_000_000],
    [1.2345678906, 1_234_567_891],
    [0, 0],
  ])("converts %s to integer nano-dollars", (amount, expected) => {
    expect(toNanoDollars(amount)).toBe(expected);
  });
});
