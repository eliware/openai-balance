import { describe, expect, test } from "@jest/globals";
import { EventEmitter } from "node:events";
import { pathToFileURL } from "node:url";

import { cli } from "../src/cli.mjs";
import { cliPath, repoRoot } from "../test-fixtures/helpers.mjs";

describe("cli entrypoint", () => {
  test("cli uses default entrypoint options when called without arguments", async () => {
    await expect(cli()).resolves.toBe(false);
  });

  test("cli runs main when the module is the entry point", async () => {
    const processObj = Object.assign(new EventEmitter(), { cwd: () => repoRoot, env: {} });
    const logs = [];

    const result = await cli({
      argv1: cliPath,
      moduleUrl: pathToFileURL(cliPath).href,
      processObj,
      argv: ["--help"],
      log: (message) => logs.push(message),
      stderr: () => {},
    });

    expect(result).toBe(true);
    expect(logs[0]).toContain("Usage: openai-balance");
  });
});
