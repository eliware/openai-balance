import { describe, expect, test } from "@jest/globals";

import { processResponse } from "../src/response-processing.mjs";

describe("response processing", () => {
  test("returns the decoded summary for a successful response", async () => {
    const summary = { grants: { data: [] } };
    await expect(
      processResponse({ status: 200, ok: true, json: async () => summary }),
    ).resolves.toEqual({ summary });
  });
});
