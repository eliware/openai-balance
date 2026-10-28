import { describe, expect, test } from "@jest/globals";
import { EventEmitter } from "node:events";

import { runCli } from "../../src/cli/runner.mjs";
import { repoRoot } from "../../test-fixtures/helpers.mjs";

describe("CLI runner", () => {
  test("sets the exit code and removes process handlers after main returns", async () => {
    const processObj = Object.assign(new EventEmitter(), { cwd: () => repoRoot, env: {} });

    await runCli({
      processObj,
      argv: ["--bad"],
      stderr: () => {},
      cwd: repoRoot,
      scriptDir: repoRoot,
    });

    expect(processObj.exitCode).toBe(1);
    expect(processObj.eventNames()).toEqual([]);
  });
});
