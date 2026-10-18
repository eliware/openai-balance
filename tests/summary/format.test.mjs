import { describe, expect, test } from "@jest/globals";

import { formatSummaryRows } from "../../src/summary/format.mjs";

const grants = [{ effectiveAt: 0, expiresAt: null, granted: 2, used: 1, available: 1 }];

describe("summary format selection", () => {
  test("uses the default USD format", () => {
    expect(formatSummaryRows(grants).rows[0][2]).toBe("$2.00");
  });

  test.each([
    [{}, "Grant"],
    [{ nanoDollars: true }, "Grant"],
    [{ combined: true }, "Grant USD"],
  ])("selects the row format for %s", (options, header) => {
    expect(formatSummaryRows(grants, options).headers).toContain(header);
  });
});
