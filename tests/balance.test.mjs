import { describe, expect, test } from "@jest/globals";

import { extractBalance } from "../src/balance.mjs";

describe("balance extraction", () => {
  test("uses the available balance or paid balance", () => {
    expect(extractBalance({ total_available: 2.5, total_paid_available: 3 })).toBe(2.5);
    expect(extractBalance({ total_paid_available: 3 })).toBe(3);
  });

  test.each([undefined, {}, { total_available: "2" }, { total_available: Infinity }])(
    "rejects invalid balances",
    (summary) => {
      expect(() => extractBalance(summary)).toThrow("missing balance");
    },
  );
});
