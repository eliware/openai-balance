import { describe, expect, test } from '@jest/globals';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

import { cli, toRealFileUrl } from '../src/cli.mjs';
import { cliPath, createRecorder, makeResponse, repoRoot } from './helpers.mjs';

describe('cli entrypoint', () => {
  test('toRealFileUrl resolves symlinks to the real file url', async () => {
    expect(toRealFileUrl(cliPath)).toBe(pathToFileURL(cliPath).href);
  });

  test('cli returns false when the module is not the entry point', async () => {
    await expect(cli({ argv1: null })).resolves.toBe(false);
  });

  test('cli uses default entrypoint options when called without arguments', async () => {
    const previousArgv1 = process.argv[1];

    try {
      process.argv[1] = null;

      await expect(cli()).resolves.toBe(false);
    } finally {
      process.argv[1] = previousArgv1;
    }
  });

  test('cli runs main when the module is the entry point', async () => {
    const recorder = createRecorder();

    const result = await cli({
      argv1: cliPath,
      moduleUrl: pathToFileURL(cliPath).href,
      cwd: repoRoot,
      scriptDir: repoRoot,
      envSource: { ENDPOINT: 'https://example.com', AUTH_HEADER: 'Bearer test-token' },
      fetchFn: async () => makeResponse({
        status: 200,
        ok: true,
        json: async () => ({ total_available: 1.5 })
      }),
      log: recorder.log,
      stderr: recorder.stderr,
      setExitCode: recorder.setExitCode
    });

    expect(result).toBe(true);
    expect(recorder.logs).toEqual(['OpenAI credit balance: $1.50']);
    expect(recorder.errors).toEqual([]);
  });
});
