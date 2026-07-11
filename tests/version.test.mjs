import { describe, expect, test } from '@jest/globals';
import fs from 'node:fs/promises';
import path from 'node:path';

import { loadPackageVersion } from '../src/version.mjs';
import { readPackageVersion, withTempDir } from './helpers.mjs';

describe('version helpers', () => {
  test('loadPackageVersion reads the package version', async () => {
    await expect(loadPackageVersion()).resolves.toBe(await readPackageVersion());
  });

  test('loadPackageVersion rejects when package version is missing', async () => {
    await withTempDir('openai-balance-', async (scriptDir) => {
      await fs.writeFile(path.join(scriptDir, 'package.json'), '{}');

      await expect(loadPackageVersion({ scriptDir })).rejects.toThrow('missing package version');
    });
  });
});
