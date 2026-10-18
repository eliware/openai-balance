import { describe, expect, test } from "@jest/globals";

import { formatCombinedRows } from "../../src/summary/combined.mjs";

describe("combined summary rows", () => {
  test("formats USD and nano-dollar values", () => {
    const result = formatCombinedRows([
      { effectiveAt: 0, expiresAt: 1, granted: 1, used: 0.5, available: 0.5 },
    ]);
    expect(result.headers).toContain("Grant USD");
    expect(result.rows[0]).toEqual([
      "1970-01-01",
      "1970-01-01",
      "$1.00",
      "1,000,000,000n",
      "$0.50",
      "500,000,000n",
      "$0.50",
      "500,000,000n",
    ]);
  });
});
