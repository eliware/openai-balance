import { describe, expect, test } from "@jest/globals";

import { readResponseBody } from "../src/response.mjs";

describe("response body reader", () => {
  test("returns the decoded response body", async () => {
    const body = { grants: { data: [] } };
    await expect(readResponseBody({ status: 200, ok: true, json: async () => body })).resolves.toBe(
      body,
    );
  });
});
