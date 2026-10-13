import { describe, expect, test } from "@jest/globals";

import { normalizeSummaryGrants } from "../src/summary-data.mjs";

describe("credit history data", () => {
  test("normalizes amounts and computes available credit", () => {
    expect(
      normalizeSummaryGrants({
        grants: {
          data: [
            {
              effective_at: 10,
              expires_at: null,
              grant_amount: "12.5",
              used_amount: "2.5",
            },
          ],
        },
      }),
    ).toEqual([{ effectiveAt: 10, expiresAt: null, granted: 12.5, used: 2.5, available: 10 }]);
  });

  test("rejects missing credit history", () => {
    expect(() => normalizeSummaryGrants({})).toThrow("missing credit history");
  });

  test.each([
    { grant_amount: "bad", used_amount: 0 },
    { grant_amount: 1, used_amount: "bad" },
    { grant_amount: Infinity, used_amount: 0 },
  ])("rejects malformed grant amounts", (grant) => {
    expect(() => normalizeSummaryGrants({ grants: { data: [grant] } })).toThrow(
      "malformed credit history",
    );
  });
});
