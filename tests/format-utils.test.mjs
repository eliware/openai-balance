import { describe, expect, test } from "@jest/globals";

import { formatNanoValue, formatUsd } from "../src/format-utils.mjs";

describe("format utilities", () => {
  test("formats dollars and nano dollars", () => {
    expect(formatUsd(2.5)).toBe("$2.50");
    expect(formatNanoValue(2.5)).toBe("2,500,000,000n");
  });
});
