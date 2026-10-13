import { describe, expect, test } from "@jest/globals";

import { normalizeSummaryGrant } from "../src/summary-grant.mjs";

describe("summary grant normalization", () => {
  test("converts amounts and calculates available credit", () => {
    expect(
      normalizeSummaryGrant({
        effective_at: 10,
        expires_at: null,
        grant_amount: "12.5",
        used_amount: "2.5",
      }),
    ).toEqual({ effectiveAt: 10, expiresAt: null, granted: 12.5, used: 2.5, available: 10 });
  });
});
