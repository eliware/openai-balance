import { describe, expect, test } from "@jest/globals";

import { classifyResponse } from "../../src/response/classify.mjs";

describe("response classification", () => {
  test.each([
    [{ status: 401, ok: false }, { error: "invalid bearer token" }],
    [{ status: 403, ok: false }, { error: "invalid bearer token" }],
    [{ status: 500, ok: false }, { error: "request failed (500)" }],
  ])("classifies failed response %s", (response, result) => {
    expect(classifyResponse(response)).toEqual(result);
  });

  test("returns null for a successful response", () => {
    expect(classifyResponse({ status: 200, ok: true })).toBeNull();
  });
});
