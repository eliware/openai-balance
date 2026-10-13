import { describe, expect, test } from "@jest/globals";

import { redactErrorMessage } from "../src/redaction.mjs";

describe("error redaction", () => {
  test("redacts the configured authorization header", () => {
    const message = redactErrorMessage(
      Error("request failed: Bearer secret-token"),
      "Bearer secret-token",
    );
    expect(message).toContain("[REDACTED]");
    expect(message).not.toContain("secret-token");
  });

  test("uses a safe fallback when an error has no message", () => {
    expect(redactErrorMessage({}, undefined)).toBe("unexpected error");
  });
});
