import { describe, expect, test } from "@jest/globals";

import { formatConflictingFlags, formatInvalidOptions } from "../src/cli-validation-message.mjs";

describe("CLI validation messages", () => {
  test.each([
    [[], "invalid options: "],
    [["--bad"], "invalid option: --bad"],
  ])("formats invalid options %s", (options, message) =>
    expect(formatInvalidOptions(options)).toBe(message),
  );

  test("formats conflicting flags", () => {
    expect(formatConflictingFlags()).toBe("can't use both -n and -c");
  });
});
