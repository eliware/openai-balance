import { describe, expect, test } from "@jest/globals";
import { isCliEntryPoint } from "../../src/cli/entry.mjs";
import { toRealFileUrl } from "../../src/real-file-url.mjs";
import { cliPath } from "../../test-fixtures/helpers.mjs";

describe("CLI entry detection", () => {
  test("matches only the executable module URL", () => {
    const fileUrl = toRealFileUrl(cliPath);
    expect(isCliEntryPoint(cliPath, fileUrl)).toBe(true);
    expect(isCliEntryPoint(null, fileUrl)).toBe(false);
    expect(isCliEntryPoint(cliPath, "file:///different.mjs")).toBe(false);
  });
});
