import { describe, expect, test } from "@jest/globals";

import { getPackageVersionValue } from "../../src/version/value.mjs";

describe("package version value", () => {
  test("returns a non-empty version string", () => {
    expect(getPackageVersionValue({ version: "15.0.1" })).toBe("15.0.1");
  });

  test.each([{}, { version: "" }, { version: 12 }, null])(
    "rejects missing or invalid version values %o",
    (packageJson) => {
      expect(() => getPackageVersionValue(packageJson)).toThrow("missing package version");
    },
  );
});
