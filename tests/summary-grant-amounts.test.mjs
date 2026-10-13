import { describe, expect, test } from "@jest/globals";

import { normalizeGrantAmounts } from "../src/summary-grant-amounts.mjs";

describe("summary grant amount validation", () => {
  test("converts grant and used amounts to numbers", () => {
    expect(normalizeGrantAmounts({ grant_amount: "12.5", used_amount: "2.5" })).toEqual({
      granted: 12.5,
      used: 2.5,
    });
  });

  test.each([
    { grant_amount: "bad", used_amount: 0 },
    { grant_amount: 1, used_amount: "bad" },
    { grant_amount: Infinity, used_amount: 0 },
  ])("rejects invalid amount data", (grant) => {
    expect(() => normalizeGrantAmounts(grant)).toThrow("malformed credit history");
  });
});
