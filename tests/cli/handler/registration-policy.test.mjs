import { describe, expect, test } from "@jest/globals";

import { createCliRegistrationPolicy } from "../../../src/cli/handler/registration-policy.mjs";

describe("CLI handler registration policy", () => {
  test("provides registered events and event-policy handlers", () => {
    const registration = createCliRegistrationPolicy();
    expect(registration.events).toEqual(["uncaughtException", "unhandledRejection", "warning"]);
    expect(registration.log).toEqual({
      debug: expect.any(Function),
      warn: expect.any(Function),
      error: expect.any(Function),
    });
  });
});
