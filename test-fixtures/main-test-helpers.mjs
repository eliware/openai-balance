import { expect } from "@jest/globals";

import { main } from "../src/main.mjs";
import { createRecorder, makeResponse, repoRoot } from "./helpers.mjs";

function mainOptions(recorder, overrides = {}) {
  return {
    cwd: repoRoot,
    scriptDir: repoRoot,
    homeDir: null,
    envSource: { ENDPOINT: "https://example.com", AUTH_HEADER: "Bearer test-token" },
    fetchFn: async () => makeResponse({ json: async () => ({ total_available: 1.23 }) }),
    log: recorder.log,
    stderr: recorder.stderr,
    setExitCode: recorder.setExitCode,
    ...overrides,
  };
}

async function expectMainFailure(overrides, message, argv = []) {
  const recorder = createRecorder();
  await expect(main(mainOptions(recorder, { argv, ...overrides }))).resolves.toBe(false);
  expect(recorder.errors).toEqual([`OpenAI credit balance: ${message}`]);
  expect(recorder.exitCode).toBe(1);
  return recorder;
}

export { expectMainFailure, mainOptions };
