import { describe, expect, test } from "@jest/globals";

import { formatExpiry } from "../src/expiry-format.mjs";

describe("expiry formatting", () => {
  test.each([undefined, null])("uses never for missing expiry %s", (value) => {
    expect(formatExpiry(value)).toBe("never");
  });

  test("formats a finite expiry date", () => {
    expect(formatExpiry(1)).toBe("1970-01-01");
  });
});
