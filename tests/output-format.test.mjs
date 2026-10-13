import { describe, expect, test } from "@jest/globals";

import { formatOutput } from "../src/output-format.mjs";

const summary = { total_available: 1.23, grants: { data: [{ grant_amount: 2, used_amount: 1 }] } };

describe("output formatter", () => {
  test.each([
    [{}, "OpenAI credit balance: $1.23"],
    [{ nanoDollars: true }, "1,230,000,000n"],
    [{ combined: true }, "$1.23 (1,230,000,000n)"],
    [{ json: true }, '"total_available": 1.23'],
    [{ summary: true }, "Effective"],
    [{ summary: true, combined: true }, "Grant USD"],
  ])("formats output for %s", (flags, expected) => {
    expect(formatOutput(summary, flags)).toContain(expected);
  });
});
