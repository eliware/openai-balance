import { describe, expect, jest, test } from "@jest/globals";
import { EventEmitter } from "node:events";

import { main } from "../src/main.mjs";
import { createRecorder, makeResponse, repoRoot } from "../test-fixtures/helpers.mjs";
import { expectMainFailure, mainOptions } from "../test-fixtures/main-test-helpers.mjs";

describe("main orchestration", () => {
  test("uses defaults when called without options", async () => {
    const processObj = globalThis.process;
    const previousEndpoint = processObj.env.ENDPOINT;
    const previousAuthHeader = processObj.env.AUTH_HEADER;
    const previousExitCode = processObj.exitCode;
    const stderr = jest.spyOn(console, "error").mockImplementation(() => {});
    processObj.env.ENDPOINT = "http://example.invalid";
    processObj.env.AUTH_HEADER = "Bearer test-token";
    try {
      await expect(main()).resolves.toBe(false);
      expect(processObj.exitCode).toBe(1);
    } finally {
      if (previousEndpoint === undefined) delete processObj.env.ENDPOINT;
      else processObj.env.ENDPOINT = previousEndpoint;
      if (previousAuthHeader === undefined) delete processObj.env.AUTH_HEADER;
      else processObj.env.AUTH_HEADER = previousAuthHeader;
      processObj.exitCode = previousExitCode;
      stderr.mockRestore();
    }
  });

  test.each([
    [["--help"], "Usage: openai-balance"],
    [["--version"], "13.0.0"],
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
    const processObj = Object.assign(new EventEmitter(), { cwd: () => repoRoot, env: {} });
    const errors = [];
    const stderr = jest
      .spyOn(console, "error")
      .mockImplementation((message) => errors.push(message));
    try {
      await expect(main({ argv: ["--bad"], processObj })).resolves.toBe(false);
      expect(processObj.exitCode).toBe(1);
      expect(errors).toEqual(["OpenAI credit balance: invalid option: --bad"]);
    } finally {
      stderr.mockRestore();
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
    await expectMainFailure(
      {
        envSource: {},
        loadConfig: async () => ({}),
        fetchFn: async () => {
          throw Error("unexpected request");
        },
      },
      "missing ENDPOINT or AUTH_HEADER",
    );
  });

  test.each(["http://example.com", "invalid endpoint"])(
    "rejects unsafe endpoint %s before a request",
    async (endpoint) => {
      const recorder = createRecorder();
      let requestCount = 0;
      await expect(
        main(
          mainOptions(recorder, {
            envSource: { ENDPOINT: endpoint, AUTH_HEADER: "Bearer private-token" },
            fetchFn: async () => {
              requestCount += 1;
              return makeResponse({ json: async () => ({ total_available: 1 }) });
            },
          }),
        ),
      ).resolves.toBe(false);
      expect(requestCount).toBe(0);
      expect(recorder.errors).toEqual([
        "OpenAI credit balance: ENDPOINT must be a valid HTTPS URL",
      ]);
      expect(recorder.errors.join(" ")).not.toContain("private-token");
    },
  );

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

  test("uses injected config and output handlers without an exit setter", async () => {
    const recorder = createRecorder();
    const processObj = Object.assign(new EventEmitter(), {
      cwd: () => repoRoot,
      env: { ENDPOINT: "https://example.com", AUTH_HEADER: "Bearer test-token" },
    });
    await expect(
      main({
        scriptDir: repoRoot,
        homeDir: null,
        loadConfig: async () => ({}),
        processObj,
        fetchFn: async () => makeResponse({ json: async () => ({ total_available: 4.2 }) }),
        log: recorder.log,
        stderr: recorder.stderr,
      }),
    ).resolves.toBe(true);
    expect(recorder.logs[0]).toContain("OpenAI credit balance: $4.20");
    expect(processObj.exitCode).toBeUndefined();
  });
});
