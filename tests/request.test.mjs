import { describe, expect, test } from "@jest/globals";
import { EventEmitter } from "node:events";
import process from "node:process";

import { requestSummary } from "../src/request.mjs";

describe("balance request lifecycle", () => {
  test("sends authorization and JSON headers with an abort signal", async () => {
    const processObj = new EventEmitter();
    const calls = [];
    const fetchFn = async (...args) => {
      calls.push(args);
      return { status: 200 };
    };
    await expect(
      requestSummary("https://example.com", "Bearer token", { fetchFn, processObj }),
    ).resolves.toEqual({ status: 200 });
    expect(calls[0][1].headers).toEqual({
      Authorization: "Bearer token",
      Accept: "application/json",
    });
    expect(calls[0][1].signal).toBeInstanceOf(AbortSignal);
    expect(processObj.listenerCount("SIGINT")).toBe(0);
  });

  test.each([
    ["SIGINT", 130],
    ["SIGTERM", 143],
    ["SIGHUP", 129],
  ])("aborts a pending request after %s", async (signalName, exitCode) => {
    const processObj = new EventEmitter();
    const exitCodes = [];
    let requestSignal;
    let startRequest;
    const requestStarted = new Promise((resolve) => {
      startRequest = resolve;
    });
    const result = requestSummary("https://example.com", "Bearer token", {
      processObj,
      setExitCode: (code) => exitCodes.push(code),
      fetchFn: async (url, options) => {
        requestSignal = options.signal;
        startRequest();
        return new Promise((resolve, reject) =>
          options.signal.addEventListener("abort", () => reject(Error("aborted"))),
        );
      },
    });
    await requestStarted;
    processObj.emit(signalName);
    await expect(result).resolves.toBeNull();
    expect(requestSignal.aborted).toBe(true);
    expect(exitCodes).toEqual([exitCode]);
    expect(processObj.listenerCount(signalName)).toBe(0);
  });

  test("rethrows request errors without a shutdown signal", async () => {
    await expect(
      requestSummary("https://example.com", "Bearer token", {
        processObj: new EventEmitter(),
        fetchFn: async () => {
          throw Error("network error");
        },
      }),
    ).rejects.toThrow("network error");
  });

  test("uses native process and fetch defaults", async () => {
    const previousFetch = global.fetch;
    const previousExitCode = process.exitCode;
    global.fetch = async () => ({ status: 200 });
    try {
      await expect(requestSummary("https://example.com", "Bearer token")).resolves.toEqual({
        status: 200,
      });
    } finally {
      global.fetch = previousFetch;
      process.exitCode = previousExitCode;
    }
  });

  test("sets the native exit code when shutdown aborts without an injected setter", async () => {
    const previousExitCode = process.exitCode;
    const processObj = new EventEmitter();
    let startRequest;
    const requestStarted = new Promise((resolve) => {
      startRequest = resolve;
    });
    const result = requestSummary("https://example.com", "Bearer token", {
      processObj,
      fetchFn: async (url, options) => {
        startRequest();
        return new Promise((resolve, reject) =>
          options.signal.addEventListener("abort", () => reject(Error("aborted"))),
        );
      },
    });
    try {
      await requestStarted;
      processObj.emit("SIGTERM");
      await expect(result).resolves.toBeNull();
      expect(process.exitCode).toBe(143);
    } finally {
      process.exitCode = previousExitCode;
    }
  });
});
