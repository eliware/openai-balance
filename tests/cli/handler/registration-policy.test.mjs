import { describe, expect, test } from "@jest/globals";

import { createCliRegistrationPolicy } from "../../../src/cli/handler/registration-policy.mjs";

describe("CLI handler registration policy", () => {
  test("uses the default event and log policy options", () => {
    const registration = createCliRegistrationPolicy();

    expect(registration.events).toEqual(["uncaughtException", "unhandledRejection", "warning"]);
    expect(() => registration.log.debug("hidden")).not.toThrow();
  });

  test("provides the registered events and log policy", () => {
    const messages = [];
    const exitCodes = [];
    const registration = createCliRegistrationPolicy({
      stderr: (message) => messages.push(message),
      setExitCode: (code) => exitCodes.push(code),
    });

    expect(registration.events).toEqual(["uncaughtException", "unhandledRejection", "warning"]);
    registration.log.warn("Warning");
    registration.log.error("Failure");
    expect(messages).toEqual(["OpenAI credit balance: Warning", "OpenAI credit balance: Failure"]);
    expect(exitCodes).toEqual([1]);
  });
});
