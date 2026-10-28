import { describe, expect, test } from "@jest/globals";

import { parsePackageVersion } from "../../src/version/parser.mjs";

describe("package version data", () => {
  test("returns a non-empty package version", () => {
    expect(parsePackageVersion('{"version":"15.0.1"}')).toBe("15.0.1");
  });

  test.each(["{}", '{"version":""}', '{"version":12}'])(
    "rejects missing or invalid version data %s",
    (contents) => {
      expect(() => parsePackageVersion(contents)).toThrow();
    },
  );
});
