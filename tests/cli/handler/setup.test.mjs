import { describe, expect, test } from "@jest/globals";
import { EventEmitter } from "node:events";

import { setupCliHandlers } from "../../../src/cli/handler/setup.mjs";

describe("CLI handler setup", () => {
  test("registers handlers with the supplied process and policy", () => {
    const processObj = new EventEmitter();
    const messages = [];
    const setExitCode = () => {};
    const setup = setupCliHandlers({
      processObj,
      stderr: (message) => messages.push(message),
      setExitCode,
    });
    expect(setup.setExitCode).toBe(setExitCode);
    processObj.emit("warning", Error("warning"));
    expect(messages).toEqual(["OpenAI credit balance: Warning"]);
    setup.handlers.removeHandlers();
    expect(setup.handlers.removed).toBe(true);
  });

  test("uses the supplied process object with default handlers", () => {
    const processObj = new EventEmitter();
    const setup = setupCliHandlers({ processObj, stderr: () => {} });
    expect(setup.handlers.removed).toBe(false);
    processObj.emit("warning", Error("warning"));
    processObj.emit("unhandledRejection", Error("failure"));
    expect(processObj.exitCode).toBe(1);
    setup.handlers.removeHandlers();
  });

  test("uses native process defaults and removes its handlers", () => {
    const setup = setupCliHandlers();
    expect(setup.handlers.removed).toBe(false);
    setup.handlers.removeHandlers();
    expect(setup.handlers.removed).toBe(true);
  });
});
