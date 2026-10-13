import { describe, expect, test } from "@jest/globals";

import { formatHelp } from "../src/help-format.mjs";

describe("help formatter", () => {
  test("renders the CLI usage text", () => {
    expect(formatHelp()).toBe(
      [
        "Usage: openai-balance [options]",
        "Options:",
        "  -h, --help           Show this help text",
        "  -v, --version        Show the package version",
        "  -j, --json           Print the full API response as pretty JSON",
        "  -n, --nano-dollars   Print the balance in nano dollars",
        "  -c, --combined       Print both USD and nano dollars",
        "  -s, --summary        Print the credit history table",
      ].join("\n"),
    );
  });
});
