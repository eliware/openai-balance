import { describe, expect, test } from "@jest/globals";

import { formatOutput } from "../src/output-format.mjs";

describe("output formatter", () => {
  test("formats JSON with stable indentation", () => {
    expect(formatOutput({ balance: 1, grants: { data: [] } }, { json: true })).toBe(
      '{\n  "balance": 1,\n  "grants": {\n    "data": []\n  }\n}',
    );
  });
});
