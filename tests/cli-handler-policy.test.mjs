import { describe, expect, test } from "@jest/globals";
import process from "node:process";

import { createCliHandlerPolicy } from "../src/cli-handler-policy.mjs";

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

  test("uses the default process exit setter", () => {
    const messages = [];
    const previousError = console.error;
    const previousCode = process.exitCode;
    process.exitCode = undefined;
    console.error = (message) => messages.push(message);
    try {
      createCliHandlerPolicy().error("Failure");
      expect(process.exitCode).toBe(1);
      expect(messages).toEqual(["OpenAI credit balance: Failure"]);
    } finally {
      console.error = previousError;
      process.exitCode = previousCode;
    }
  });
});
