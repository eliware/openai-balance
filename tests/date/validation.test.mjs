import { describe, expect, test } from "@jest/globals";

import { isValidDateSeconds } from "../../src/date/validation.mjs";

describe("date validation", () => {
  test("accepts valid epoch seconds", () => {
    expect(isValidDateSeconds(0)).toBe(true);
  });

  test.each([undefined, null, "0", NaN, Infinity, -Infinity, 1e20])(
    "rejects invalid epoch seconds %s",
    (value) => {
      expect(isValidDateSeconds(value)).toBe(false);
    },
  );
});
