import { describe, expect, test } from "@jest/globals";

import { getCliArgs } from "../../src/cli/argv.mjs";

describe("CLI argument source", () => {
  test("uses supplied arguments", () => {
    expect(getCliArgs(["--help"])).toEqual(["--help"]);
  });

  test("reads command arguments from the process argument list", () => {
    expect(getCliArgs(undefined, ["node", "app.mjs", "--json", "-n"])).toEqual(["--json", "-n"]);
  });

  test("uses process.argv by default", () => {
    expect(getCliArgs(undefined, ["node", "app.mjs", "--summary"])).toEqual(["--summary"]);
  });
});
