import { describe, expect, test } from "@jest/globals";

import { parsePackageVersion } from "../../src/version/parser.mjs";

describe("package version data", () => {
  test("returns a non-empty package version", () => {
    expect(parsePackageVersion('{"version":"15.0.1"}')).toBe("15.0.1");
  });

  test("rejects malformed JSON", () => {
    expect(() => parsePackageVersion("invalid JSON")).toThrow(SyntaxError);
  });
});
