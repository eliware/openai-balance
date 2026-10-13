import { describe, expect, test } from "@jest/globals";

import { formatDate, formatExpiry } from "../src/date-format.mjs";

describe("date formatting", () => {
  test("formats epoch seconds as a date", () => {
    expect(formatDate(0)).toBe("1970-01-01");
  });

  test.each([undefined, "0", NaN])("uses a dash for invalid date %s", (value) => {
    expect(formatDate(value)).toBe("-");
  });

  test.each([undefined, null])("uses never for missing expiry %s", (value) => {
    expect(formatExpiry(value)).toBe("never");
  });

  test("formats a finite expiry date", () => {
    expect(formatExpiry(1)).toBe("1970-01-01");
  });
});
