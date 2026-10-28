import { describe, expect, test } from "@jest/globals";

import { createCliExitPolicy } from "../../../src/cli/handler/policy.mjs";

describe("CLI exit policy", () => {
  test("sets the error exit code through the supplied setter", () => {
    const exitCodes = [];
    const policy = createCliExitPolicy({
      setExitCode: (code) => exitCodes.push(code),
    });
    policy.setErrorExitCode();
    expect(exitCodes).toEqual([1]);
  });

  test("uses the supplied process object for the default exit setter", () => {
    const processObj = {};
    createCliExitPolicy({ processObj }).setErrorExitCode();
    expect(processObj.exitCode).toBe(1);
  });

  test("creates a policy with default process options", () => {
    expect(createCliExitPolicy()).toEqual({ setErrorExitCode: expect.any(Function) });
  });
});
