import { describe, expect, test } from "@jest/globals";

import { parsePackageVersion } from "../src/version-data.mjs";

describe("package version data", () => {
  test("returns a non-empty package version", () => {
    expect(parsePackageVersion('{"version":"12.0.0"}')).toBe("12.0.0");
  });

  test.each(["{}", '{"version":""}', '{"version":12}'])(
    "rejects missing or invalid version data %s",
    (contents) => {
      expect(() => parsePackageVersion(contents)).toThrow();
    },
  );
});
