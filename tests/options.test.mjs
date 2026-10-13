import { describe, expect, test } from "@jest/globals";

import { cliOptions, createDefaultFlags } from "../src/options.mjs";

describe("CLI option definitions", () => {
  test("defines each supported option and its help text", () => {
    expect(cliOptions).toEqual([
      { name: "help", short: "h", long: "--help", description: "Show this help text" },
      { name: "version", short: "v", long: "--version", description: "Show the package version" },
      {
        name: "json",
        short: "j",
        long: "--json",
        description: "Print the full API response as pretty JSON",
      },
      {
        name: "nanoDollars",
        short: "n",
        long: "--nano-dollars",
        description: "Print the balance in nano dollars",
      },
      {
        name: "combined",
        short: "c",
        long: "--combined",
        description: "Print both USD and nano dollars",
      },
      {
        name: "summary",
        short: "s",
        long: "--summary",
        description: "Print the credit history table",
      },
    ]);
  });

  test("creates a false value for each option", () => {
    expect(createDefaultFlags()).toEqual({
      help: false,
      version: false,
      json: false,
      nanoDollars: false,
      combined: false,
      summary: false,
    });
  });
});
