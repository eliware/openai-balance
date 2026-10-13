import { describe, expect, test } from "@jest/globals";

import { formatDate } from "../src/date-format.mjs";

describe("date formatting", () => {
  test("formats epoch seconds as a date", () => {
    expect(formatDate(0)).toBe("1970-01-01");
  });

  test.each([undefined, "0", NaN, Infinity, -Infinity, 1e20])(
    "uses a dash for invalid date %s",
    (value) => {
      expect(formatDate(value)).toBe("-");
    },
  );
});
