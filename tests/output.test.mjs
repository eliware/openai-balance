import { describe, expect, test } from "@jest/globals";

import { printOutput } from "../src/output.mjs";

const summary = { total_available: 1.23, grants: { data: [{ grant_amount: 2, used_amount: 1 }] } };

describe("CLI output modes", () => {
  test.each([
    [{}, /OpenAI credit balance: \$1\.23$/],
    [{ nanoDollars: true }, /1,230,000,000n$/],
    [{ combined: true }, /\$1\.23 \(1,230,000,000n\)$/],
    [{ json: true }, /"total_available": 1\.23/],
    [{ summary: true }, /Effective/],
    [{ summary: true, combined: true }, /Grant USD/],
  ])("prints output for flags %s", (flags, expected) => {
    const logs = [];
    printOutput(summary, flags, { log: (value) => logs.push(value), now: () => new Date(0) });
    expect(logs[0]).toMatch(expected);
  });

  test("uses native console and clock defaults", () => {
    const previousLog = console.log;
    const logs = [];
    console.log = (value) => logs.push(value);
    try {
      printOutput(summary, {});
      expect(logs[0]).toMatch(/^\d{4}-\d{2}-\d{2}T[^ ]+Z OpenAI credit balance: \$1\.23$/);
    } finally {
      console.log = previousLog;
    }
  });
});
