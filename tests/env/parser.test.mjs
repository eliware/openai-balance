import { describe, expect, test } from "@jest/globals";

import { parseEnvContents } from "../../src/env/parser.mjs";

describe("environment parser", () => {
  test("parses values, comments, blank lines, and matching quotes", () => {
    expect(parseEnvContents("A=1\nB=\"hello world\"\nC='hi'\nD\n# comment\n\n")).toEqual({
      A: "1",
      B: "hello world",
      C: "hi",
    });
  });

  test("ignores empty and invalid keys", () => {
    expect(parseEnvContents("=empty\nBAD-KEY=value\n__proto__=blocked\nGOOD=value")).toEqual({
      GOOD: "value",
    });
  });
});
