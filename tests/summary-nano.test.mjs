import { describe, expect, test } from "@jest/globals";

import { formatNanoRows } from "../src/summary-nano.mjs";

describe("nano-dollar summary rows", () => {
  test("formats nano-dollar grant amounts", () => {
    const result = formatNanoRows([
      { effectiveAt: 0, expiresAt: null, granted: 1, used: 0.5, available: 0.5 },
    ]);
    expect(result.rows[0]).toEqual([
      "1970-01-01",
      "never",
      "1,000,000,000n",
      "500,000,000n",
      "500,000,000n",
    ]);
  });
});
