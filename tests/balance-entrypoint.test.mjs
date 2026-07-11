import { describe, expect, test } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

import { repoRoot } from './helpers.mjs';

describe('balance.mjs entrypoint', () => {
  test('prints help when run directly', () => {
    const output = execFileSync('node', [path.join(repoRoot, 'balance.mjs'), '--help'], {
      encoding: 'utf8'
    });

    expect(output).toContain('Usage: openai-balance [options]');
  });
});
