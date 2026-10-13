import { describe, expect, test } from "@jest/globals";
import { pathToFileURL } from "node:url";

import { isCliEntryPoint, toRealFileUrl } from "../src/cli-entry.mjs";
import { cliPath } from "../test-fixtures/helpers.mjs";

describe("CLI entry detection", () => {
  test("resolves a path to its real file URL", () => {
    expect(toRealFileUrl(cliPath)).toBe(pathToFileURL(cliPath).href);
  });

  test("matches only the executable module URL", () => {
    const fileUrl = toRealFileUrl(cliPath);
    expect(isCliEntryPoint(cliPath, fileUrl)).toBe(true);
    expect(isCliEntryPoint(null, fileUrl)).toBe(false);
    expect(isCliEntryPoint(cliPath, "file:///different.mjs")).toBe(false);
  });
});
