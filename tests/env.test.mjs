import { describe, expect, test } from '@jest/globals';
import fs from 'node:fs/promises';
import path from 'node:path';

import { getConfigValue, loadConfigEnvFile, loadEnvFile } from '../src/env.mjs';
import { withTempDir, writeEnv } from './helpers.mjs';

describe('env helpers', () => {
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
