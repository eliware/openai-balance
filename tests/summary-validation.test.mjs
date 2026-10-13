import { describe, expect, test } from "@jest/globals";

import { getSummaryGrants } from "../src/summary-validation.mjs";

describe("summary response validation", () => {
  test("returns the grant collection", () => {
    const grants = [{ grant_amount: 1 }];
    expect(getSummaryGrants({ grants: { data: grants } })).toBe(grants);
  });

  test("rejects missing or invalid grant collections", () => {
    expect(() => getSummaryGrants({})).toThrow("missing credit history");
    expect(() => getSummaryGrants({ grants: { data: {} } })).toThrow("missing credit history");
  });
});
