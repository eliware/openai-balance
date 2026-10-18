import { describe, expect, test } from "@jest/globals";

import { runCliCommand } from "../../src/cli/command.mjs";
import { repoRoot } from "../../test-fixtures/helpers.mjs";

describe("CLI information commands", () => {
  test("prints help and reports that it handled the command", async () => {
    const logs = [];
    await expect(
      runCliCommand({ help: true, version: false }, { log: (value) => logs.push(value) }),
    ).resolves.toBe(true);
    expect(logs[0]).toContain("Usage:");
  });

  test("prints the package version and reports that it handled the command", async () => {
    const logs = [];
    await expect(
      runCliCommand(
        { help: false, version: true },
        { scriptDir: repoRoot, log: (value) => logs.push(value) },
      ),
    ).resolves.toBe(true);
    expect(logs[0]).toBe("13.0.0");
  });

  test("reports when no information command applies", async () => {
    await expect(runCliCommand({ help: false, version: false })).resolves.toBe(false);
  });
});
