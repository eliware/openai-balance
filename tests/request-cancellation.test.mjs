import { describe, expect, test } from "@jest/globals";
import { EventEmitter } from "node:events";

import { registerRequestCancellation } from "../src/request-cancellation.mjs";

describe("request cancellation", () => {
  test("registers and removes default process handlers", () => {
    const cancellation = registerRequestCancellation();
    expect(cancellation.signal.aborted).toBe(false);
    cancellation.removeHandlers();
  });

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

  test("uses the supplied process object for the default exit setter", () => {
    const processObj = new EventEmitter();
    const cancellation = registerRequestCancellation({ processObj });
    processObj.emit("SIGINT");
    expect(cancellation.signal.aborted).toBe(true);
    expect(cancellation.wasInterrupted()).toBe(true);
    expect(processObj.exitCode).toBe(130);
    cancellation.removeHandlers();
  });
});
