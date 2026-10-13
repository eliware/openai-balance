import { describe, expect, test } from "@jest/globals";
import { EventEmitter } from "node:events";
import process from "node:process";

import { main } from "../src/main.mjs";
import { createRecorder, makeResponse, withTempDir } from "../test-fixtures/helpers.mjs";
import { expectMainFailure, mainOptions } from "../test-fixtures/main-test-helpers.mjs";

describe("main orchestration", () => {
  test.each([
    [["--help"], "Usage: openai-balance"],
    [["--version"], "12.0.0"],
  ])("prints information for %s", async (argv, expected) => {
    const recorder = createRecorder();
    await expect(main(mainOptions(recorder, { argv }))).resolves.toBe(true);
    expect(recorder.logs[0]).toContain(expected);
  });

  test("prints a timestamped balance after one request", async () => {
    const recorder = createRecorder();
    const fetchFn = async () => makeResponse({ json: async () => ({ total_available: 10.16 }) });
    await expect(main(mainOptions(recorder, { fetchFn }))).resolves.toBe(true);
    expect(recorder.logs[0]).toMatch(/^\d{4}-\d{2}-\d{2}T[^ ]+Z OpenAI credit balance: \$10\.16$/);
    expect(recorder.errors).toEqual([]);
  });

  test("sets the default process exit code for invalid arguments", async () => {
    const previousCode = process.exitCode;
    const previousError = console.error;
    const errors = [];
    process.exitCode = undefined;
    console.error = (message) => errors.push(message);
    try {
      await expect(main({ argv: ["--bad"] })).resolves.toBe(false);
      expect(process.exitCode).toBe(1);
      expect(errors).toEqual(["OpenAI credit balance: invalid option: --bad"]);
    } finally {
      process.exitCode = previousCode;
      console.error = previousError;
    }
  });

  test.each([
    [401, "invalid bearer token"],
    [403, "invalid bearer token"],
    [500, "request failed (500)"],
  ])("reports HTTP status %s", async (status, message) => {
    await expectMainFailure(
      { fetchFn: async () => makeResponse({ status, ok: false, json: async () => ({}) }) },
      message,
    );
  });

  test("redacts the authorization header from request errors", async () => {
    const recorder = createRecorder();
    await expect(
      main(
        mainOptions(recorder, {
          fetchFn: async () => {
            throw Error("request failed: Bearer test-token");
          },
        }),
      ),
    ).resolves.toBe(false);
    expect(recorder.errors[0]).not.toContain("test-token");
    expect(recorder.errors[0]).toContain("[REDACTED]");
  });

  test("reports missing configuration without a request", async () => {
    await withTempDir("balance-cwd-", async (cwd) =>
      withTempDir("balance-script-", async (scriptDir) => {
        await expectMainFailure(
          {
            cwd,
            scriptDir,
            envSource: {},
            fetchFn: async () => {
              throw Error("unexpected request");
            },
          },
          "missing ENDPOINT or AUTH_HEADER",
        );
      }),
    );
  });

  test("returns false after a shutdown signal aborts the request", async () => {
    const recorder = createRecorder();
    const processObj = new EventEmitter();
    let startRequest;
    const requestStarted = new Promise((resolve) => {
      startRequest = resolve;
    });
    const result = main(
      mainOptions(recorder, {
        processObj,
        fetchFn: async (url, init) => {
          startRequest();
          return new Promise((resolve, reject) =>
            init.signal.addEventListener("abort", () => reject(Error("aborted"))),
          );
        },
      }),
    );
    await requestStarted;
    processObj.emit("SIGINT");
    await expect(result).resolves.toBe(false);
    expect(recorder.exitCode).toBe(130);
    expect(recorder.errors).toEqual([]);
  });

  test.each([
    [
      async () => {
        throw Error("parse failed");
      },
      "parse failed",
    ],
    [
      async () => {
        throw {};
      },
      "unexpected error",
    ],
  ])("reports response parsing errors", async (json, message) => {
    await expectMainFailure({ fetchFn: async () => makeResponse({ json }) }, message);
  });

  test("reports an argument parsing error before it reads credentials", async () => {
    await expectMainFailure({ argv: {} }, "argv is not iterable");
  });

  test("uses process defaults when called without options", async () => {
    const previous = [
      global.fetch,
      console.log,
      console.error,
      process.exitCode,
      process.env.ENDPOINT,
      process.env.AUTH_HEADER,
    ];
    const logs = [];
    process.exitCode = undefined;
    global.fetch = async () => makeResponse({ json: async () => ({ total_available: 4.2 }) });
    console.log = (message) => logs.push(message);
    console.error = () => {};
    process.env.ENDPOINT = "https://example.com";
    process.env.AUTH_HEADER = "Bearer default-token";
    try {
      await expect(main()).resolves.toBe(true);
      expect(logs[0]).toContain("OpenAI credit balance: $4.20");
      expect(process.exitCode).toBeUndefined();
    } finally {
      [global.fetch, console.log, console.error, process.exitCode] = previous;
      if (previous[4] === undefined) delete process.env.ENDPOINT;
      else process.env.ENDPOINT = previous[4];
      if (previous[5] === undefined) delete process.env.AUTH_HEADER;
      else process.env.AUTH_HEADER = previous[5];
    }
  });
});
