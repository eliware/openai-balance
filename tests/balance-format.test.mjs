import { describe, expect, test } from "@jest/globals";

import { formatBalance, formatCombinedBalance, formatNanoDollars } from "../src/balance-format.mjs";

describe("balance output formatters", () => {
  test("formats USD", () => {
    expect(formatBalance(10.163356375)).toBe("OpenAI credit balance: $10.16");
  });

  test("formats USD and nano-dollars", () => {
    expect(formatCombinedBalance(10.163356375)).toBe(
      "OpenAI credit balance: $10.16 (10,163,356,375n)",
    );
  });

  test("formats nano-dollars", () => {
    expect(formatNanoDollars(10.163356375)).toBe("OpenAI credit balance: 10,163,356,375n");
  });
});
