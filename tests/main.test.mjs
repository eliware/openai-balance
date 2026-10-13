import { describe, expect, test } from "@jest/globals";
import { EventEmitter } from "node:events";
import process from "node:process";

import { main } from "../src/main.mjs";
import { createRecorder, makeResponse, repoRoot, withTempDir } from "../test-fixtures/helpers.mjs";

function options(recorder, overrides = {}) {
  return {
    cwd: repoRoot,
    scriptDir: repoRoot,
    homeDir: null,
    envSource: { ENDPOINT: "https://example.com", AUTH_HEADER: "Bearer test-token" },
    fetchFn: async () => makeResponse({ json: async () => ({ total_available: 1.23 }) }),
    log: recorder.log,
    stderr: recorder.stderr,
    setExitCode: recorder.setExitCode,
    ...overrides,
  };
}

async function expectFailure(overrides, message, argv = []) {
  const recorder = createRecorder();
  await expect(main(options(recorder, { argv, ...overrides }))).resolves.toBe(false);
  expect(recorder.errors).toEqual([`OpenAI credit balance: ${message}`]);
  expect(recorder.exitCode).toBe(1);
  return recorder;
}

describe("main orchestration", () => {
  test.each([
    [["--help"], "Usage: openai-balance"],
    [["--version"], "12.0.0"],
  ])("prints information for %s", async (argv, expected) => {
    const recorder = createRecorder();
    await expect(main(options(recorder, { argv }))).resolves.toBe(true);
    expect(recorder.logs[0]).toContain(expected);
  });

  test("prints a timestamped balance after one request", async () => {
    const recorder = createRecorder();
    const fetchFn = async () => makeResponse({ json: async () => ({ total_available: 10.16 }) });
    await expect(main(options(recorder, { fetchFn }))).resolves.toBe(true);
    expect(recorder.logs[0]).toMatch(/^\d{4}-\d{2}-\d{2}T[^ ]+Z OpenAI credit balance: \$10\.16$/);
    expect(recorder.errors).toEqual([]);
  });

  test("sets the default process exit code for invalid arguments", async () => {
    const previousCode = process.exitCode;
    const previousError = console.error;
    process.exitCode = undefined;
    console.error = () => {};
    try {
      await expect(main({ argv: ["--bad"] })).resolves.toBe(false);
      expect(process.exitCode).toBe(1);
    } finally {
      process.exitCode = previousCode;
      console.error = previousError;
    }
  });

  test.each([
    [["--wat"], "invalid option: --wat"],
    [["--wat", "-x"], "invalid options: --wat, -x"],
    [["-n", "-c"], "can't use both -n and -c"],
  ])("rejects invalid arguments %s", async (argv, message) => {
    const recorder = await expectFailure({}, message, argv);
    expect(recorder.logs).toEqual([]);
  });

  test.each([
    [401, "invalid bearer token"],
    [403, "invalid bearer token"],
    [500, "request failed (500)"],
  ])("reports HTTP status %s", async (status, message) => {
    await expectFailure(
      { fetchFn: async () => makeResponse({ status, ok: false, json: async () => ({}) }) },
      message,
    );
  });

  test("reports missing configuration without a request", async () => {
    await withTempDir("balance-cwd-", async (cwd) =>
      withTempDir("balance-script-", async (scriptDir) => {
        await expectFailure(
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
      options(recorder, {
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
    [{ object: "credit_summary" }, "missing balance"],
    [{ total_available: Infinity }, "missing balance"],
  ])("reports malformed balance data", async (body, message) => {
    await expectFailure({ fetchFn: async () => makeResponse({ json: async () => body }) }, message);
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
    await expectFailure({ fetchFn: async () => makeResponse({ json }) }, message);
  });

  test("reports an argument parsing error before it reads credentials", async () => {
    await expectFailure({ argv: {} }, "argv is not iterable");
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
