import { describe, expect, test } from "@jest/globals";

import { createCliHandlerPolicy } from "../../../src/cli/handler/policy.mjs";

describe("CLI handler policy", () => {
  test("logs warnings and errors and sets the error exit code", () => {
    const messages = [];
    const exitCodes = [];
    const policy = createCliHandlerPolicy({
      stderr: (message) => messages.push(message),
      setExitCode: (code) => exitCodes.push(code),
    });
    policy.debug("hidden");
    policy.warn("Warning");
    policy.error("Unhandled Error");
    expect(messages).toEqual([
      "OpenAI credit balance: Warning",
      "OpenAI credit balance: Unhandled Error",
    ]);
    expect(exitCodes).toEqual([1]);
  });

  test("uses the supplied process object for the default exit setter", () => {
    const messages = [];
    const processObj = {};
    createCliHandlerPolicy({ stderr: (message) => messages.push(message), processObj }).error(
      "Failure",
    );
    expect(processObj.exitCode).toBe(1);
    expect(messages).toEqual(["OpenAI credit balance: Failure"]);
  });

  test("uses default dependencies for debug messages", () => {
    expect(() => createCliHandlerPolicy().debug("hidden")).not.toThrow();
  });
});
