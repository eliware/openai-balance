import { describe, expect, test } from "@jest/globals";
import { EventEmitter } from "node:events";
import { pathToFileURL } from "node:url";

import { cli } from "../src/cli.mjs";
import { cliPath, createRecorder, makeResponse, repoRoot } from "../test-fixtures/helpers.mjs";

describe("cli entrypoint", () => {
  test("cli uses default entrypoint options when called without arguments", async () => {
    await expect(cli()).resolves.toBe(false);
  });

  test("cli runs main when the module is the entry point", async () => {
    const recorder = createRecorder();
    const processObj = Object.assign(new EventEmitter(), { cwd: () => repoRoot, env: {} });

    const result = await cli({
      argv1: cliPath,
      moduleUrl: pathToFileURL(cliPath).href,
      processObj,
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
    const processObj = Object.assign(new EventEmitter(), { cwd: () => repoRoot, env: {} });
    await cli({
      processObj,
      argv1: cliPath,
      moduleUrl: pathToFileURL(cliPath).href,
      argv: ["--bad"],
      stderr: () => {},
    });
    expect(processObj.exitCode).toBe(1);
  });
});
