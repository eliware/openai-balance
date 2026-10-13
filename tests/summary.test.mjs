import { describe, expect, test } from "@jest/globals";

import { formatSummary } from "../src/summary.mjs";
import { readExampleSummary } from "../test-fixtures/helpers.mjs";

describe("credit history formatting", () => {
  test("renders USD and nano-dollar rows", async () => {
    const summary = await readExampleSummary();
    expect(formatSummary(summary)).toContain("$20.00");
    expect(formatSummary(summary, { nanoDollars: true })).toContain("10,000,000,000n");
  });

  test("renders combined values, dates, and missing expiry", () => {
    const summary = {
      grants: { data: [{ effective_at: 0, expires_at: null, grant_amount: 2, used_amount: 1 }] },
    };
    const output = formatSummary(summary, { combined: true });
    expect(output).toContain("Grant USD");
    expect(output).toContain("1970-01-01");
    expect(output).toContain("never");
    expect(output).toContain("1,000,000,000n");
  });

  test("renders invalid dates and finite expiry dates", () => {
    const summary = {
      grants: { data: [{ effective_at: NaN, expires_at: 1, grant_amount: 1, used_amount: 0 }] },
    };
    expect(formatSummary(summary)).toContain("-         | 1970-01-01");
  });

  test("renders an empty history table", () => {
    expect(formatSummary({ grants: { data: [] } })).toContain("Effective");
  });
});
