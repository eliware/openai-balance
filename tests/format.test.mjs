import { describe, expect, test } from "@jest/globals";

import {
  formatBalance,
  formatCombinedBalance,
  formatHelp,
  formatNanoDollars,
} from "../src/format.mjs";

describe("format helpers", () => {
  test("formatBalance renders USD with two decimals", () => {
    expect(formatBalance(10.163356375)).toBe("OpenAI credit balance: $10.16");
  });

  test("formatCombinedBalance renders both USD and nano dollars", () => {
    expect(formatCombinedBalance(10.163356375)).toBe(
      "OpenAI credit balance: $10.16 (10,163,356,375n)",
    );
  });

  test("formatNanoDollars renders comma-separated nano dollars", () => {
    expect(formatNanoDollars(10.163356375)).toBe("OpenAI credit balance: 10,163,356,375n");
  });

  test("formatHelp renders the CLI usage text", () => {
    expect(formatHelp()).toBe(
      [
        "Usage: openai-balance [options]",
        "Options:",
        "  -h, --help           Show this help text",
        "  -v, --version        Show the package version",
        "  -j, --json           Print the full API response as pretty JSON",
        "  -n, --nano-dollars   Print the balance in nano dollars",
        "  -c, --combined       Print both USD and nano dollars",
        "  -s, --summary        Print the credit history table",
      ].join("\n"),
    );
  });
});
