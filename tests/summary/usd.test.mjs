import { describe, expect, test } from "@jest/globals";

import { formatUsdRows } from "../../src/summary/usd.mjs";

describe("USD summary rows", () => {
  test("formats dates and USD grant amounts", () => {
    const result = formatUsdRows([
      { effectiveAt: 0, expiresAt: null, granted: 2, used: 1, available: 1 },
    ]);
    expect(result.headers).toEqual(["Effective", "Expires", "Grant", "Used", "Available"]);
    expect(result.rows[0]).toEqual(["1970-01-01", "never", "$2.00", "$1.00", "$1.00"]);
  });
});
