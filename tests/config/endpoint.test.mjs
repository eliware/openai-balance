import { describe, expect, test } from "@jest/globals";

import { isHttpsEndpoint } from "../../src/config/endpoint.mjs";

describe("HTTPS endpoint validation", () => {
  test.each([
    ["http://example.com", false],
    ["not a URL", false],
    ["https://example.com", true],
  ])("checks endpoint %s", (endpoint, expected) => {
    expect(isHttpsEndpoint(endpoint)).toBe(expected);
  });
});
