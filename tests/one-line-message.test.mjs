import { describe, expect, test } from "@jest/globals";

import { toOneLineMessage } from "../src/one-line-message.mjs";

describe("one-line message formatter", () => {
  test("replaces one or more line breaks with one space", () => {
    expect(toOneLineMessage("failed\r\n\nrequest")).toBe("failed request");
  });

  test("converts non-string values to text", () => {
    expect(toOneLineMessage(12)).toBe("12");
  });
});
