import { describe, expect, test } from "@jest/globals";

import { signalExitCodes } from "../src/signal-exit-codes.mjs";

describe("signal exit code policy", () => {
  test("maps shutdown events to process exit codes", () => {
    expect(signalExitCodes).toEqual({ SIGINT: 130, SIGTERM: 143, SIGHUP: 129, beforeExit: 0 });
  });
});
