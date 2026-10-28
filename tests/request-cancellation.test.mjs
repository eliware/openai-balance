import { describe, expect, test } from "@jest/globals";
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
});
