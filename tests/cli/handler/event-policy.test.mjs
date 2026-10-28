import { describe, expect, test } from "@jest/globals";

import { createCliEventPolicy } from "../../../src/cli/handler/event-policy.mjs";

describe("CLI event policy", () => {
  test("uses default dependencies for debug messages", () => {
    expect(() => createCliEventPolicy().debug("hidden")).not.toThrow();
  });

  test("formats warning and error messages and sets an error exit code", () => {
    const messages = [];
    const exitCodes = [];
    const policy = createCliEventPolicy({
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
    const processObj = {};
    const messages = [];
    const policy = createCliEventPolicy({
      processObj,
      stderr: (message) => messages.push(message),
    });

    policy.error("Failure");

    expect(processObj.exitCode).toBe(1);
    expect(messages).toEqual(["OpenAI credit balance: Failure"]);
  });
});
