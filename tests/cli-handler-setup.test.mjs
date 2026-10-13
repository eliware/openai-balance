import { describe, expect, test } from "@jest/globals";
import { EventEmitter } from "node:events";

import { setupCliHandlers } from "../src/cli-handler-setup.mjs";

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

  test("uses default process handlers", () => {
    const setup = setupCliHandlers();
    expect(setup.handlers.removed).toBe(false);
    setup.handlers.removeHandlers();
  });
});
