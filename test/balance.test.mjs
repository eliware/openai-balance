import { describe, expect, test } from '@jest/globals';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  cli,
  extractBalance,
  fail,
  formatBalance,
  getConfigValue,
  loadEnvFile,
  loadConfigEnvFile,
  main
} from '../balance.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cliPath = path.join(repoRoot, 'balance.mjs');

function createRecorder() {
  const logs = [];
  const errors = [];
  let exitCode;

  return {
    logs,
    errors,
    get exitCode() {
      return exitCode;
    },
    log: (message) => logs.push(message),
    stderr: (message) => errors.push(message),
    setExitCode: (code) => {
      exitCode = code;
    }
  };
}

async function withTempDir(prefix, run) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
  return run(dir);
}

async function writeEnv(dir, contents) {
  await fs.writeFile(path.join(dir, '.env'), contents);
}

function makeResponse({ status = 200, ok = true, json }) {
  return {
    status,
    ok,
    json
  };
}

describe('balance helpers', () => {
  test('formatBalance renders USD with two decimals', () => {
    expect(formatBalance(10.163356375)).toBe('OpenAI credit balance: $10.16');
  });

  test('extractBalance prefers total_available', () => {
    expect(extractBalance({ total_available: 10.16, total_paid_available: 99 })).toBe(10.16);
  });

  test('extractBalance falls back to total_paid_available', () => {
    expect(extractBalance({ total_paid_available: 9.87 })).toBe(9.87);
  });

  test('extractBalance accepts zero', () => {
    expect(extractBalance({ total_available: 0, total_paid_available: 99 })).toBe(0);
  });

  test('extractBalance rejects NaN', () => {
    expect(() => extractBalance({ total_available: Number.NaN })).toThrow('missing balance');
  });

  test('extractBalance rejects missing values', () => {
    expect(() => extractBalance({})).toThrow('missing balance');
  });

  test('fail uses console.error and the default exit code setter', () => {
    const previousError = console.error;
    const previousExitCode = process.exitCode;
    const messages = [];
    process.exitCode = undefined;
    console.error = (message) => messages.push(message);

    try {
      fail('example');

      expect(messages).toEqual(['OpenAI credit balance: example']);
      expect(process.exitCode).toBe(1);
    } finally {
      console.error = previousError;
      process.exitCode = previousExitCode;
    }
  });

  test('getConfigValue prefers process env over file values', () => {
    expect(getConfigValue('ENDPOINT', { ENDPOINT: 'file-value' }, { ENDPOINT: 'env-value' })).toBe('env-value');
  });

  test('getConfigValue falls back to file values', () => {
    expect(getConfigValue('ENDPOINT', { ENDPOINT: 'file-value' }, {})).toBe('file-value');
  });

  test('getConfigValue uses process.env by default', () => {
    const previous = process.env.TEST_BALANCE_CONFIG_VALUE;
    process.env.TEST_BALANCE_CONFIG_VALUE = 'env-value';

    try {
      expect(getConfigValue('TEST_BALANCE_CONFIG_VALUE', { TEST_BALANCE_CONFIG_VALUE: 'file-value' })).toBe('env-value');
    } finally {
      if (previous === undefined) {
        delete process.env.TEST_BALANCE_CONFIG_VALUE;
      } else {
        process.env.TEST_BALANCE_CONFIG_VALUE = previous;
      }
    }
  });

  test('loadEnvFile parses comments, blanks, quoted values, and bare lines', async () => {
    await withTempDir('openai-balance-', async (dir) => {
      const file = path.join(dir, '.env');
      await fs.writeFile(file, 'A=1\nB="hello world"\nC=\'hi\'\nD\n# comment\n\n');

      await expect(loadEnvFile(file)).resolves.toEqual({ A: '1', B: 'hello world', C: 'hi' });
    });
  });

  test('loadEnvFile returns {} for missing files', async () => {
    await withTempDir('openai-balance-', async (dir) => {
      await expect(loadEnvFile(path.join(dir, 'missing.env'))).resolves.toEqual({});
    });
  });

  test('loadEnvFile rethrows non-ENOENT errors', async () => {
    await expect(
      loadEnvFile('ignored.env', async () => {
        const error = new Error('no access');
        error.code = 'EACCES';
        throw error;
      })
    ).rejects.toThrow('no access');
  });

  test('loadConfigEnvFile prefers the working directory and falls back to the script directory', async () => {
    await withTempDir('openai-balance-', async (cwd) => {
      await withTempDir('openai-balance-', async (scriptDir) => {
        await writeEnv(scriptDir, 'ENDPOINT=https://script.example.com\nAUTH_HEADER=Bearer script-token\n');
        await writeEnv(cwd, 'AUTH_HEADER=Bearer cwd-token\n');

        await expect(loadConfigEnvFile({ cwd, scriptDir })).resolves.toEqual({
          ENDPOINT: 'https://script.example.com',
          AUTH_HEADER: 'Bearer cwd-token'
        });
      });
    });
  });

  test('loadConfigEnvFile uses its default cwd and scriptDir', async () => {
    await expect(loadConfigEnvFile()).resolves.toEqual(expect.any(Object));
  });

  test('loadConfigEnvFile uses the same directory once when cwd matches scriptDir', async () => {
    await withTempDir('openai-balance-', async (dir) => {
      await writeEnv(dir, 'ENDPOINT=https://same.example.com\nAUTH_HEADER=Bearer same-token\n');

      await expect(loadConfigEnvFile({ cwd: dir, scriptDir: dir })).resolves.toEqual({
        ENDPOINT: 'https://same.example.com',
        AUTH_HEADER: 'Bearer same-token'
      });
    });
  });
});

describe('balance cli logic', () => {
  test('cli runs when invoked through a symlink', async () => {
    await withTempDir('openai-balance-', async (cwd) => {
      const linkPath = path.join(cwd, 'openai-balance');
      await fs.symlink(cliPath, linkPath);

      const recorder = createRecorder();
      const result = await cli({
        argv1: linkPath,
        cwd,
        scriptDir: repoRoot,
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
      expect(recorder.logs).toEqual(['OpenAI credit balance: $1.23']);
      expect(recorder.errors).toEqual([]);
      expect(recorder.exitCode).toBeUndefined();
    });
  });

  test('main prints the balance from the API', async () => {
    await withTempDir('openai-balance-', async (cwd) => {
      await withTempDir('openai-balance-', async (scriptDir) => {
        await writeEnv(scriptDir, 'ENDPOINT=https://script.example.com/balance\nAUTH_HEADER=Bearer script-token\n');
        await writeEnv(cwd, 'AUTH_HEADER=Bearer cwd-token\n');

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

    const previousEndpoint = process.env.ENDPOINT;
    const previousAuthHeader = process.env.AUTH_HEADER;
    process.env.ENDPOINT = 'https://example.com';
    process.env.AUTH_HEADER = 'Bearer default-token';

    try {
      const result = await main();

      expect(result).toBe(true);
      expect(logs).toEqual(['OpenAI credit balance: $4.20']);
      expect(errors).toEqual([]);
      expect(process.exitCode).toBeUndefined();
    } finally {
      global.fetch = previousFetch;
      console.log = previousLog;
      console.error = previousError;
      process.exitCode = previousExitCode;

      if (previousEndpoint === undefined) {
        delete process.env.ENDPOINT;
      } else {
        process.env.ENDPOINT = previousEndpoint;
      }

      if (previousAuthHeader === undefined) {
        delete process.env.AUTH_HEADER;
      } else {
        process.env.AUTH_HEADER = previousAuthHeader;
      }
    }
  });

  test('cli returns false when the module is not the entry point', async () => {
    await expect(cli({ argv1: null })).resolves.toBe(false);
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
