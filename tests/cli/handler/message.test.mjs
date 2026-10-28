import { describe, expect, test } from "@jest/globals";

import { formatCliHandlerMessage } from "../../../src/cli/handler/message.mjs";

describe("CLI handler message formatting", () => {
  test("adds the CLI prefix and replaces line breaks", () => {
    expect(formatCliHandlerMessage("failed\r\nrequest")).toBe(
      "OpenAI credit balance: failed request",
    );
  });

  test("converts non-string messages to text", () => {
    expect(formatCliHandlerMessage(12)).toBe("OpenAI credit balance: 12");
  });
});
