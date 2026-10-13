import { describe, expect, test } from "@jest/globals";
import process from "node:process";

import { registerCliHandlers } from "../src/cli-handlers.mjs";

describe("CLI process handlers", () => {
  test("logs safe event labels and removes handlers", () => {
    const errors = [];
    const previousError = console.error;
    const previousExitCode = process.exitCode;
    process.exitCode = undefined;
    console.error = (message) => errors.push(message);
    const handlers = registerCliHandlers();

    try {
      process.emit("warning", Error("private warning"));
      process.emit("unhandledRejection", Error("secret-value"));
      expect(errors).toEqual([
        "OpenAI credit balance: Warning",
        "OpenAI credit balance: Unhandled Rejection",
      ]);
      expect(process.exitCode).toBe(1);
      expect(handlers.removed).toBe(false);

      handlers.removeHandlers();
      expect(handlers.removed).toBe(true);
      expect(errors).toHaveLength(2);
    } finally {
      handlers.removeHandlers();
      console.error = previousError;
      process.exitCode = previousExitCode;
    }
  });
});
