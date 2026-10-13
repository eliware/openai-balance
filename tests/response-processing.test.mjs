import { describe, expect, test } from "@jest/globals";

import { processResponse } from "../src/response-processing.mjs";

describe("response processing", () => {
  test.each([
    [{ status: 401, ok: false }, { error: "invalid bearer token" }],
    [{ status: 403, ok: false }, { error: "invalid bearer token" }],
    [{ status: 500, ok: false }, { error: "request failed (500)" }],
  ])("returns a failure for response %s", async (response, result) => {
    await expect(processResponse(response)).resolves.toEqual(result);
  });

  test("returns the decoded summary for a successful response", async () => {
    const summary = { grants: { data: [] } };
    await expect(
      processResponse({ status: 200, ok: true, json: async () => summary }),
    ).resolves.toEqual({ summary });
  });
});
