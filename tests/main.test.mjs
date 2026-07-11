import { describe, expect, test } from '@jest/globals';
import process from 'node:process';

import { fail, main } from '../src/main.mjs';
import { createRecorder, makeResponse, readExampleSummary, readPackageVersion, repoRoot, withTempDir, writeEnv } from './helpers.mjs';

async function withProcessEnv(name, value, run) {
  const previous = process.env[name];
  process.env[name] = value;

  try {
    return await run();
  } finally {
    if (previous === undefined) {
      delete process.env[name];
    } else {
      process.env[name] = previous;
    }
  }
}

describe('main orchestration', () => {
  test('fail uses the default exit code setter', () => {
    const recorder = createRecorder();
    const previousConsoleError = console.error;
    const previousExitCode = process.exitCode;

    process.exitCode = undefined;
    console.error = recorder.stderr;

    try {
      fail('custom error');

      expect(recorder.errors).toEqual(['OpenAI credit balance: custom error']);
      expect(process.exitCode).toBe(1);
    } finally {
      console.error = previousConsoleError;
      process.exitCode = previousExitCode;
    }
  });

  test('main prints the balance from the API', async () => {
    await withTempDir('openai-balance-', async (cwd) => {
      await withTempDir('openai-balance-', async (scriptDir) => {
        await writeEnv(scriptDir, `ENDPOINT=https://script.example.com/balance
AUTH_HEADER=Bearer script-token
`);
        await writeEnv(cwd, `AUTH_HEADER=Bearer cwd-token
`);

        const recorder = createRecorder();
        const calls = [];

        const result = await main({
          cwd,
          scriptDir,
          envSource: {},
          fetchFn: async (url, options) => {
            calls.push({ url, options });
            return makeResponse({
              status: 200,
              ok: true,
              json: async () => ({ total_available: 10.163356375 })
            });
          },
          log: recorder.log,
          stderr: recorder.stderr,
          setExitCode: recorder.setExitCode
        });

        expect(result).toBe(true);
        expect(calls).toEqual([
          {
            url: 'https://script.example.com/balance',
            options: {
              headers: {
                Authorization: 'Bearer cwd-token',
                Accept: 'application/json'
              }
            }
          }
        ]);
        expect(recorder.logs).toEqual(['OpenAI credit balance: $10.16']);
        expect(recorder.errors).toEqual([]);
        expect(recorder.exitCode).toBeUndefined();
      });
    });
  });

  test('main prints combined balance output when requested', async () => {
    const recorder = createRecorder();

    const result = await main({
      cwd: repoRoot,
      scriptDir: repoRoot,
      argv: ['--combined'],
      envSource: { ENDPOINT: 'https://example.com', AUTH_HEADER: 'Bearer test-token' },
      fetchFn: async () => makeResponse({
        status: 200,
        ok: true,
        json: async () => ({ total_available: 1.23 })
      }),
      log: recorder.log,
      stderr: recorder.stderr,
      setExitCode: recorder.setExitCode
    });

    expect(result).toBe(true);
    expect(recorder.logs).toEqual(['OpenAI credit balance: $1.23 (1,230,000,000n)']);
  });

  test('main prints a summary table in USD by default', async () => {
    const recorder = createRecorder();
    const summary = await readExampleSummary();

    const result = await main({
      cwd: repoRoot,
      scriptDir: repoRoot,
      argv: ['--summary'],
      envSource: { ENDPOINT: 'https://example.com', AUTH_HEADER: 'Bearer test-token' },
      fetchFn: async () => makeResponse({
        status: 200,
        ok: true,
        json: async () => summary
      }),
      log: recorder.log,
      stderr: recorder.stderr,
      setExitCode: recorder.setExitCode
    });

    expect(result).toBe(true);
    expect(recorder.logs[0]).toContain('Effective');
    expect(recorder.logs[0]).toContain('$20.00');
  });

  test('main prints a combined summary table when requested', async () => {
    const recorder = createRecorder();
    const summary = await readExampleSummary();

    const result = await main({
      cwd: repoRoot,
      scriptDir: repoRoot,
      argv: ['--summary', '--combined'],
      envSource: { ENDPOINT: 'https://example.com', AUTH_HEADER: 'Bearer test-token' },
      fetchFn: async () => makeResponse({
        status: 200,
        ok: true,
        json: async () => summary
      }),
      log: recorder.log,
      stderr: recorder.stderr,
      setExitCode: recorder.setExitCode
    });

    expect(result).toBe(true);
    expect(recorder.logs[0]).toContain('Grant n');
    expect(recorder.logs[0]).toContain('Grant USD');
  });

  test('main accepts grouped short flags for summary output', async () => {
    const recorder = createRecorder();
    const summary = await readExampleSummary();

    const result = await main({
      cwd: repoRoot,
      scriptDir: repoRoot,
      argv: ['-sn'],
      envSource: { ENDPOINT: 'https://example.com', AUTH_HEADER: 'Bearer test-token' },
      fetchFn: async () => makeResponse({
        status: 200,
        ok: true,
        json: async () => summary
      }),
      log: recorder.log,
      stderr: recorder.stderr,
      setExitCode: recorder.setExitCode
    });

    expect(result).toBe(true);
    expect(recorder.logs[0]).toContain('Grant');
    expect(recorder.logs[0]).toContain('n');
  });

  test('main rejects nano-dollars and combined together', async () => {
    const recorder = createRecorder();

    const result = await main({
      cwd: repoRoot,
      scriptDir: repoRoot,
      argv: ['-n', '-c'],
      envSource: { ENDPOINT: 'https://example.com', AUTH_HEADER: 'Bearer test-token' },
      fetchFn: async () => makeResponse({
        status: 200,
        ok: true,
        json: async () => ({ total_available: 1.23 })
      }),
      log: recorder.log,
      stderr: recorder.stderr,
      setExitCode: recorder.setExitCode
    });

    expect(result).toBe(false);
    expect(recorder.logs).toEqual([]);
    expect(recorder.errors).toEqual(["OpenAI credit balance: can't use both -n and -c"]);
    expect(recorder.exitCode).toBe(1);
  });

  test('main rejects a single invalid command line option', async () => {
    const recorder = createRecorder();

    const result = await main({
      cwd: repoRoot,
      scriptDir: repoRoot,
      argv: ['--wat'],
      envSource: { ENDPOINT: 'https://example.com', AUTH_HEADER: 'Bearer test-token' },
      fetchFn: async () => makeResponse({
        status: 200,
        ok: true,
        json: async () => ({ total_available: 1.23 })
      }),
      log: recorder.log,
      stderr: recorder.stderr,
      setExitCode: recorder.setExitCode
    });

    expect(result).toBe(false);
    expect(recorder.logs).toEqual([]);
    expect(recorder.errors).toEqual(['OpenAI credit balance: invalid option: --wat']);
    expect(recorder.exitCode).toBe(1);
  });

  test('main rejects invalid command line options', async () => {
    const recorder = createRecorder();

    const result = await main({
      cwd: repoRoot,
      scriptDir: repoRoot,
      argv: ['--wat', '-x'],
      envSource: { ENDPOINT: 'https://example.com', AUTH_HEADER: 'Bearer test-token' },
      fetchFn: async () => makeResponse({
        status: 200,
        ok: true,
        json: async () => ({ total_available: 1.23 })
      }),
      log: recorder.log,
      stderr: recorder.stderr,
      setExitCode: recorder.setExitCode
    });

    expect(result).toBe(false);
    expect(recorder.logs).toEqual([]);
    expect(recorder.errors).toEqual(['OpenAI credit balance: invalid options: --wat, -x']);
    expect(recorder.exitCode).toBe(1);
  });

  test('main prints a one-line invalid token error for 401', async () => {
    const recorder = createRecorder();

    const result = await main({
      cwd: repoRoot,
      scriptDir: repoRoot,
      envSource: { ENDPOINT: 'https://example.com', AUTH_HEADER: 'Bearer test-token' },
      fetchFn: async () => makeResponse({ status: 401, ok: false, json: async () => ({ error: 'unauthorized' }) }),
      log: recorder.log,
      stderr: recorder.stderr,
      setExitCode: recorder.setExitCode
    });

    expect(result).toBe(false);
    expect(recorder.logs).toEqual([]);
    expect(recorder.errors).toEqual(['OpenAI credit balance: invalid bearer token']);
    expect(recorder.exitCode).toBe(1);
  });

  test('main prints a one-line invalid token error for 403', async () => {
    const recorder = createRecorder();

    const result = await main({
      cwd: repoRoot,
      scriptDir: repoRoot,
      envSource: { ENDPOINT: 'https://example.com', AUTH_HEADER: 'Bearer test-token' },
      fetchFn: async () => makeResponse({ status: 403, ok: false, json: async () => ({ error: 'forbidden' }) }),
      log: recorder.log,
      stderr: recorder.stderr,
      setExitCode: recorder.setExitCode
    });

    expect(result).toBe(false);
    expect(recorder.errors).toEqual(['OpenAI credit balance: invalid bearer token']);
    expect(recorder.exitCode).toBe(1);
  });

  test('main reports non-OK HTTP errors', async () => {
    const recorder = createRecorder();

    const result = await main({
      cwd: repoRoot,
      scriptDir: repoRoot,
      envSource: { ENDPOINT: 'https://example.com', AUTH_HEADER: 'Bearer test-token' },
      fetchFn: async () => makeResponse({ status: 500, ok: false, json: async () => ({ error: 'server error' }) }),
      log: recorder.log,
      stderr: recorder.stderr,
      setExitCode: recorder.setExitCode
    });

    expect(result).toBe(false);
    expect(recorder.errors).toEqual(['OpenAI credit balance: request failed (500)']);
    expect(recorder.exitCode).toBe(1);
  });

  test('main reports missing config', async () => {
    const recorder = createRecorder();
    const previousExitCode = process.exitCode;
    process.exitCode = undefined;

    try {
      const result = await withTempDir('openai-balance-', async (cwd) => {
        return withTempDir('openai-balance-', async (scriptDir) => {
          return main({
            cwd,
            scriptDir,
            envSource: {},
            fetchFn: async () => {
              throw new Error('fetch should not run');
            },
            log: recorder.log,
            stderr: recorder.stderr
          });
        });
      });

      expect(result).toBe(false);
      expect(recorder.errors).toEqual(['OpenAI credit balance: missing ENDPOINT or AUTH_HEADER']);
      expect(process.exitCode).toBe(1);
    } finally {
      process.exitCode = previousExitCode;
    }
  });

  test('main reports missing balance in the response', async () => {
    const recorder = createRecorder();

    const result = await main({
      cwd: repoRoot,
      scriptDir: repoRoot,
      envSource: { ENDPOINT: 'https://example.com', AUTH_HEADER: 'Bearer test-token' },
      fetchFn: async () => makeResponse({
        status: 200,
        ok: true,
        json: async () => ({ object: 'credit_summary' })
      }),
      log: recorder.log,
      stderr: recorder.stderr,
      setExitCode: recorder.setExitCode
    });

    expect(result).toBe(false);
    expect(recorder.errors).toEqual(['OpenAI credit balance: missing balance']);
    expect(recorder.exitCode).toBe(1);
  });

  test('main reports a real error message when response parsing fails', async () => {
    const recorder = createRecorder();

    const result = await main({
      cwd: repoRoot,
      scriptDir: repoRoot,
      envSource: { ENDPOINT: 'https://example.com', AUTH_HEADER: 'Bearer test-token' },
      fetchFn: async () => makeResponse({
        status: 200,
        ok: true,
        json: async () => {
          throw new Error('boom');
        }
      }),
      log: recorder.log,
      stderr: recorder.stderr,
      setExitCode: recorder.setExitCode
    });

    expect(result).toBe(false);
    expect(recorder.errors).toEqual(['OpenAI credit balance: boom']);
    expect(recorder.exitCode).toBe(1);
  });

  test('main falls back to a generic unexpected error message', async () => {
    const recorder = createRecorder();

    const result = await main({
      cwd: repoRoot,
      scriptDir: repoRoot,
      envSource: { ENDPOINT: 'https://example.com', AUTH_HEADER: 'Bearer test-token' },
      fetchFn: async () => makeResponse({
        status: 200,
        ok: true,
        json: async () => {
          throw {};
        }
      }),
      log: recorder.log,
      stderr: recorder.stderr,
      setExitCode: recorder.setExitCode
    });

    expect(result).toBe(false);
    expect(recorder.errors).toEqual(['OpenAI credit balance: unexpected error']);
    expect(recorder.exitCode).toBe(1);
  });

  test('main uses default options when invoked without arguments', async () => {
    const previousFetch = global.fetch;
    const previousLog = console.log;
    const previousError = console.error;
    const previousExitCode = process.exitCode;
    const logs = [];
    const errors = [];

    process.exitCode = undefined;
    global.fetch = async () => makeResponse({
      status: 200,
      ok: true,
      json: async () => ({ total_available: 4.2 })
    });
    console.log = (message) => logs.push(message);
    console.error = (message) => errors.push(message);

    try {
      await withProcessEnv('ENDPOINT', 'https://example.com', async () => {
        return withProcessEnv('AUTH_HEADER', 'Bearer default-token', async () => {
          const result = await main();

          expect(result).toBe(true);
          expect(logs).toEqual(['OpenAI credit balance: $4.20']);
          expect(errors).toEqual([]);
          expect(process.exitCode).toBeUndefined();
        });
      });
    } finally {
      global.fetch = previousFetch;
      console.log = previousLog;
      console.error = previousError;
      process.exitCode = previousExitCode;
    }
  });

  test('main prints help, version, json, nano dollar, and combined output modes', async () => {
    const helpRecorder = createRecorder();
    const versionRecorder = createRecorder();
    const jsonRecorder = createRecorder();
    const nanoRecorder = createRecorder();
    const combinedRecorder = createRecorder();
    const packageVersion = await readPackageVersion();

    await expect(main({ argv: ['--help'], log: helpRecorder.log, stderr: helpRecorder.stderr })).resolves.toBe(true);
    await expect(main({ argv: ['--version'], log: versionRecorder.log, stderr: versionRecorder.stderr })).resolves.toBe(true);
    await expect(main({
      argv: ['--json'],
      envSource: { ENDPOINT: 'https://example.com', AUTH_HEADER: 'Bearer test-token' },
      fetchFn: async () => makeResponse({
        status: 200,
        ok: true,
        json: async () => ({ object: 'credit_summary', total_available: 1.23 })
      }),
      log: jsonRecorder.log,
      stderr: jsonRecorder.stderr,
      setExitCode: jsonRecorder.setExitCode
    })).resolves.toBe(true);
    await expect(main({
      argv: ['--nano-dollars'],
      envSource: { ENDPOINT: 'https://example.com', AUTH_HEADER: 'Bearer test-token' },
      fetchFn: async () => makeResponse({
        status: 200,
        ok: true,
        json: async () => ({ total_available: 1.23 })
      }),
      log: nanoRecorder.log,
      stderr: nanoRecorder.stderr,
      setExitCode: nanoRecorder.setExitCode
    })).resolves.toBe(true);
    await expect(main({
      argv: ['--combined'],
      envSource: { ENDPOINT: 'https://example.com', AUTH_HEADER: 'Bearer test-token' },
      fetchFn: async () => makeResponse({
        status: 200,
        ok: true,
        json: async () => ({ total_available: 1.23 })
      }),
      log: combinedRecorder.log,
      stderr: combinedRecorder.stderr,
      setExitCode: combinedRecorder.setExitCode
    })).resolves.toBe(true);

    expect(helpRecorder.logs[0]).toContain('Usage: openai-balance [options]');
    expect(versionRecorder.logs).toEqual([packageVersion]);
    expect(jsonRecorder.logs).toEqual([JSON.stringify({ object: 'credit_summary', total_available: 1.23 }, null, 2)]);
    expect(nanoRecorder.logs).toEqual(['OpenAI credit balance: 1,230,000,000n']);
    expect(combinedRecorder.logs).toEqual(['OpenAI credit balance: $1.23 (1,230,000,000n)']);
  });
});
