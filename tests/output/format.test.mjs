import { describe, expect, test } from "@jest/globals";

import { formatOutput } from "../../src/output/format.mjs";

describe("output formatter", () => {
  test("formats JSON with stable indentation", () => {
    expect(formatOutput({ total_available: 1, grants: { data: [] } }, { json: true })).toBe(
      '{\n  "total_available": 1,\n  "grants": {\n    "data": []\n  }\n}',
    );
  });

  test("prints JSON data without balance fields", () => {
    expect(formatOutput({ status: "ok" }, { json: true })).toBe('{\n  "status": "ok"\n}');
  });

  test.each([null, "invalid", 2, []])("rejects non-object JSON responses", (summary) => {
    expect(() => formatOutput(summary, { json: true })).toThrow("invalid API response");
  });
});
