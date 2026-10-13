import { describe, expect, test } from "@jest/globals";
import { execFileSync } from "node:child_process";
import process from "node:process";
import { pathToFileURL } from "node:url";

import { cli } from "../src/cli.mjs";
import { cliPath, createRecorder, makeResponse, repoRoot } from "../test-fixtures/helpers.mjs";

describe("cli entrypoint", () => {
  test("public executable starts", () => {
    expect(() => execFileSync("node", [cliPath, "--help"], { encoding: "utf8" })).not.toThrow();
  });

  test("cli uses default entrypoint options when called without arguments", async () => {
    const previousArgv1 = process.argv[1];

    try {
      process.argv[1] = null;

      await expect(cli()).resolves.toBe(false);
    } finally {
      process.argv[1] = previousArgv1;
    }
  });

  test("cli runs main when the module is the entry point", async () => {
    const recorder = createRecorder();

    const result = await cli({
      argv1: cliPath,
      moduleUrl: pathToFileURL(cliPath).href,
      cwd: repoRoot,
      scriptDir: repoRoot,
      envSource: { ENDPOINT: "https://example.com", AUTH_HEADER: "Bearer test-token" },
      fetchFn: async () =>
        makeResponse({
          status: 200,
          ok: true,
          json: async () => ({ total_available: 1.5 }),
        }),
      log: recorder.log,
      stderr: recorder.stderr,
      setExitCode: recorder.setExitCode,
    });

    expect(result).toBe(true);
    expect(recorder.logs[0]).toMatch(/^\d{4}-\d{2}-\d{2}T[^ ]+Z OpenAI credit balance: \$1\.50$/);
    expect(recorder.errors).toEqual([]);
  });

  test("sets the process exit code when callers omit a setter", async () => {
    const previousCode = process.exitCode;
    const previousError = console.error;
    process.exitCode = undefined;
    console.error = () => {};
    try {
      await cli({ argv1: cliPath, moduleUrl: pathToFileURL(cliPath).href, argv: ["--bad"] });
      expect(process.exitCode).toBe(1);
    } finally {
      process.exitCode = previousCode;
      console.error = previousError;
    }
  });
});
