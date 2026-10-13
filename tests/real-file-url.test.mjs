import { describe, expect, test } from "@jest/globals";
import { pathToFileURL } from "node:url";

import { toRealFileUrl } from "../src/real-file-url.mjs";
import { cliPath } from "../test-fixtures/helpers.mjs";

describe("real file URL conversion", () => {
  test("converts the executable path to its file URL", () => {
    expect(toRealFileUrl(cliPath)).toBe(pathToFileURL(cliPath).href);
  });
});
