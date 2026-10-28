import { describe, expect, test } from "@jest/globals";

import { isHttpsEndpoint } from "../../src/config/endpoint.mjs";

describe("HTTPS endpoint validation", () => {
  test.each([
    ["http://example.com", false],
    ["not a URL", false],
    ["https://example.com", false],
    ["https://api.openai.com:444", false],
    ["https://user:pass@api.openai.com", false],
    ["https://api.openai.com/v1/dashboard/billing/credit_grants", true],
  ])("checks endpoint %s", (endpoint, expected) => {
    expect(isHttpsEndpoint(endpoint)).toBe(expected);
  });
});
