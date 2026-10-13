import { describe, expect, test } from "@jest/globals";

import { formatHelp } from "../src/help-format.mjs";

describe("help formatter", () => {
  test("renders usage and all option descriptions", () => {
    expect(formatHelp()).toContain("Usage: openai-balance [options]");
    expect(formatHelp()).toContain("-s, --summary");
  });
});
