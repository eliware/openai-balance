import { describe, expect, test } from "@jest/globals";

import { getResponseError } from "../src/response-status.mjs";

describe("HTTP response status", () => {
  test.each([
    [{ status: 401, ok: false }, "invalid bearer token"],
    [{ status: 403, ok: false }, "invalid bearer token"],
    [{ status: 500, ok: false }, "request failed (500)"],
    [{ status: 200, ok: true }, null],
  ])("classifies response %s", (response, error) => {
    expect(getResponseError(response)).toBe(error);
  });
});
