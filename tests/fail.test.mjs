import { describe, expect, test } from "@jest/globals";
import process from "node:process";

import { fail } from "../src/fail.mjs";
import { createRecorder } from "../test-fixtures/helpers.mjs";

describe("fail helper", () => {
  test("uses the default exit code setter", () => {
    const recorder = createRecorder();
    const previousConsoleError = console.error;
    const previousExitCode = process.exitCode;
    process.exitCode = undefined;
    console.error = recorder.stderr;
    try {
      fail("custom error");
      expect(recorder.errors).toEqual(["OpenAI credit balance: custom error"]);
      expect(process.exitCode).toBe(1);
    } finally {
      console.error = previousConsoleError;
      process.exitCode = previousExitCode;
    }
  });
});
