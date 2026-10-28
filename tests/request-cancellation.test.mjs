import { describe, expect, jest, test } from "@jest/globals";
import { EventEmitter } from "node:events";

import { registerRequestCancellation } from "../src/request-cancellation.mjs";

describe("request cancellation", () => {
  test("registers and removes signal handlers", () => {
    const processObj = new EventEmitter();
    const cancellation = registerRequestCancellation({ processObj, setExitCode: () => {} });
    expect(cancellation.signal.aborted).toBe(false);
    expect(processObj.listenerCount("SIGINT")).toBe(1);
    expect(processObj.listenerCount("SIGTERM")).toBe(1);
    expect(processObj.listenerCount("SIGHUP")).toBe(1);
    cancellation.removeHandlers();
    expect(processObj.listenerCount("SIGINT")).toBe(0);
    expect(processObj.listenerCount("SIGTERM")).toBe(0);
    expect(processObj.listenerCount("SIGHUP")).toBe(0);
  });

  test("does not treat beforeExit as a request cancellation signal", async () => {
    const processObj = new EventEmitter();
    const exitCodes = [];
    const cancellation = registerRequestCancellation({
      processObj,
      setExitCode: (code) => exitCodes.push(code),
    });
    jest.useFakeTimers();
    try {
      processObj.emit("beforeExit", 0);
      await jest.advanceTimersByTimeAsync(0);

      expect(cancellation.signal.aborted).toBe(false);
      expect(cancellation.wasInterrupted()).toBe(false);
      expect(exitCodes).toEqual([]);
    } finally {
      cancellation.removeHandlers();
      jest.useRealTimers();
    }
  });
});
