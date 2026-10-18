import { describe, expect, test } from "@jest/globals";
import { EventEmitter } from "node:events";

import { registerCliHandlers } from "../../src/cli/handlers.mjs";

describe("CLI process handlers", () => {
  test("uses default handlers and removes them", () => {
    const handlers = registerCliHandlers();
    expect(handlers.removed).toBe(false);
    handlers.removeHandlers();
    expect(handlers.removed).toBe(true);
  });

  test("logs safe event labels and removes handlers", () => {
    const errors = [];
    const processObj = new EventEmitter();
    const handlers = registerCliHandlers({
      processObj,
      stderr: (message) => errors.push(message),
    });

    try {
      processObj.emit("warning", Error("private warning"));
      processObj.emit("unhandledRejection", Error("secret-value"));
      expect(errors).toEqual([
        "OpenAI credit balance: Warning",
        "OpenAI credit balance: Unhandled Rejection",
      ]);
      expect(processObj.exitCode).toBe(1);
      expect(handlers.removed).toBe(false);

      handlers.removeHandlers();
      expect(handlers.removed).toBe(true);
      expect(errors).toHaveLength(2);
    } finally {
      handlers.removeHandlers();
    }
  });
});
