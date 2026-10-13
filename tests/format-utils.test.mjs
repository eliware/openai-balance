import { describe, expect, test } from "@jest/globals";

import { formatUsd } from "../src/format-utils.mjs";

describe("format utilities", () => {
  test("formats dollars", () => {
    expect(formatUsd(2.5)).toBe("$2.50");
  });
});
