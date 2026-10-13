import { describe, expect, test } from "@jest/globals";
import { EventEmitter } from "node:events";
import process from "node:process";

import { registerRequestCancellation } from "../src/request-cancellation.mjs";

describe("request cancellation", () => {
  test("aborts on shutdown, sets the exit code, and removes signal handlers", () => {
    const processObj = new EventEmitter();
    const exitCodes = [];
    const cancellation = registerRequestCancellation({
      processObj,
      setExitCode: (code) => exitCodes.push(code),
    });
    processObj.emit("SIGINT");
    expect(cancellation.signal.aborted).toBe(true);
    expect(cancellation.wasInterrupted()).toBe(true);
    expect(exitCodes).toEqual([130]);
    cancellation.removeHandlers();
    expect(processObj.listenerCount("SIGINT")).toBe(0);
  });

  test("uses native process and exit code defaults", () => {
    const previousCode = process.exitCode;
    process.exitCode = undefined;
    const cancellation = registerRequestCancellation();
    try {
      process.emit("SIGINT");
      expect(cancellation.signal.aborted).toBe(true);
      expect(cancellation.wasInterrupted()).toBe(true);
      expect(process.exitCode).toBe(130);
    } finally {
      cancellation.removeHandlers();
      process.exitCode = previousCode;
    }
  });
});
