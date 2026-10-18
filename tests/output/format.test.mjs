import { describe, expect, test } from "@jest/globals";

import { formatOutput } from "../../src/output/format.mjs";

describe("output formatter", () => {
  test("formats JSON with stable indentation", () => {
    expect(formatOutput({ total_available: 1, grants: { data: [] } }, { json: true })).toBe(
      '{\n  "total_available": 1,\n  "grants": {\n    "data": []\n  }\n}',
    );
  });

  test("rejects JSON data without a numeric balance", () => {
    expect(() => formatOutput({ grants: { data: [] } }, { json: true })).toThrow("missing balance");
  });
});
