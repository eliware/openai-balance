import { describe, expect, test } from "@jest/globals";

import { applyShortOptions } from "../src/short-options.mjs";

describe("short option expansion", () => {
  test("sets flags from grouped short options", () => {
    const flags = {};
    const invalid = [];
    applyShortOptions("-sn", flags, { s: "summary", n: "nanoDollars" }, (value) =>
      invalid.push(value),
    );
    expect(flags).toEqual({ summary: true, nanoDollars: true });
    expect(invalid).toEqual([]);
  });

  test("records unknown short options", () => {
    const invalid = [];
    applyShortOptions("-sx", {}, { s: "summary" }, (value) => invalid.push(value));
    expect(invalid).toEqual(["-x"]);
  });
});
