import { describe, expect, test } from "@jest/globals";

import { normalizeGrantAmounts } from "../../src/summary/grant-amounts.mjs";

describe("summary grant amount validation", () => {
  test("accepts numeric grant and used amounts", () => {
    expect(normalizeGrantAmounts({ grant_amount: 12.5, used_amount: 2.5 })).toEqual({
      granted: 12.5,
      used: 2.5,
    });
  });

  test.each([
    { grant_amount: "bad", used_amount: 0 },
    { grant_amount: 1, used_amount: "bad" },
    { grant_amount: Infinity, used_amount: 0 },
    { grant_amount: null, used_amount: 0 },
    { grant_amount: "", used_amount: 0 },
    { grant_amount: "1", used_amount: 0 },
    { grant_amount: 1, used_amount: null },
    { grant_amount: 1, used_amount: "" },
    { grant_amount: 1, used_amount: "2" },
  ])("rejects invalid amount data", (grant) => {
    expect(() => normalizeGrantAmounts(grant)).toThrow("malformed credit history");
  });
});
