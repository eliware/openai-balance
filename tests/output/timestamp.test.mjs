import { describe, expect, test } from "@jest/globals";

import { formatTimestampedOutput } from "../../src/output/timestamp.mjs";

describe("timestamped output formatter", () => {
  test("adds the supplied time to a balance line", () => {
    expect(formatTimestampedOutput("balance", () => new Date(0))).toBe(
      "1970-01-01T00:00:00.000Z balance",
    );
  });

  test("uses the current time by default", () => {
    expect(formatTimestampedOutput("balance")).toMatch(/^\d{4}-\d{2}-\d{2}T[^ ]+Z balance$/);
  });
});
