import { describe, expect, test } from "@jest/globals";

import { validateCliFlags } from "../src/cli-validation.mjs";

describe("CLI flag validation", () => {
  test.each([
    [{ invalidOptions: ["--bad"] }, "invalid option: --bad"],
    [{ invalidOptions: ["--bad", "-x"] }, "invalid options: --bad, -x"],
    [{ invalidOptions: [], nanoDollars: true, combined: true }, "can't use both -n and -c"],
  ])("returns a validation message for %s", (flags, message) => {
    expect(validateCliFlags(flags)).toBe(message);
  });

  test("returns null for valid flags", () => {
    expect(validateCliFlags({ invalidOptions: [], nanoDollars: false, combined: false })).toBe(
      null,
    );
  });

  test("uses singular and plural labels for invalid options", () => {
    expect(validateCliFlags({ invalidOptions: ["--bad"] })).toBe("invalid option: --bad");
    expect(validateCliFlags({ invalidOptions: ["--bad", "-x"] })).toBe(
      "invalid options: --bad, -x",
    );
  });
});
