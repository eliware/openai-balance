import { describe, expect, test } from "@jest/globals";

import { fetchSummary } from "../src/fetch-summary.mjs";

describe("summary fetch transport", () => {
  test("sends the endpoint, authorization, accept header, and signal", async () => {
    const response = { status: 200 };
    const signal = new AbortController().signal;
    const calls = [];
    await expect(
      fetchSummary("https://example.com", "Bearer token", {
        signal,
        fetchFn: async (...args) => {
          calls.push(args);
          return response;
        },
      }),
    ).resolves.toBe(response);
    expect(calls).toEqual([
      [
        "https://example.com",
        { headers: { Authorization: "Bearer token", Accept: "application/json" }, signal },
      ],
    ]);
  });

  test("uses global fetch when no function is supplied", async () => {
    const previousFetch = global.fetch;
    const response = { status: 200 };
    global.fetch = async () => response;
    try {
      await expect(fetchSummary("https://example.com", "Bearer token")).resolves.toBe(response);
    } finally {
      global.fetch = previousFetch;
    }
  });

  test("propagates transport errors", async () => {
    await expect(
      fetchSummary("https://example.com", "Bearer token", {
        fetchFn: async () => {
          throw new Error("network error");
        },
      }),
    ).rejects.toThrow("network error");
  });
});
