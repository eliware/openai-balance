import { describe, expect, jest, test } from "@jest/globals";

import { fail } from "../../../src/cli/handler/fail.mjs";
import { createRecorder } from "../../../test-fixtures/helpers.mjs";

describe("fail helper", () => {
  test("uses the default exit code setter", () => {
    const recorder = createRecorder();
    const processObj = {};
    fail("custom error", recorder.stderr, undefined, processObj);
    expect(recorder.errors).toEqual(["OpenAI credit balance: custom error"]);
    expect(processObj.exitCode).toBe(1);
  });

  test("uses the default error writer", () => {
    const processObj = {};
    const stderr = jest.spyOn(console, "error").mockImplementation(() => {});
    try {
      fail("custom error", undefined, undefined, processObj);
      expect(stderr).toHaveBeenCalledWith("OpenAI credit balance: custom error");
      expect(processObj.exitCode).toBe(1);
    } finally {
      stderr.mockRestore();
    }
  });
});
