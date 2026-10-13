import { describe, expect, test } from "@jest/globals";

import { createInvalidOptions } from "../src/invalid-options.mjs";

describe("invalid option collector", () => {
  test("keeps each invalid option once and preserves order", () => {
    const options = createInvalidOptions();
    options.add("--bad");
    options.add("-x");
    options.add("--bad");
    expect(options.values).toEqual(["--bad", "-x"]);
  });
});
