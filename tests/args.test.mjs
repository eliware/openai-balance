import { describe, expect, test } from '@jest/globals';
import process from 'node:process';

import { parseCliArgs } from '../src/args.mjs';

describe('cli args', () => {
  test('parseCliArgs detects help flags', () => {
    expect(parseCliArgs(['-h'])).toEqual({ help: true, version: false, json: false, nanoDollars: false });
    expect(parseCliArgs(['--help'])).toEqual({ help: true, version: false, json: false, nanoDollars: false });
  });

  test('parseCliArgs detects version, json, and nano-dollars flags', () => {
    expect(parseCliArgs(['--version', '--json', '-n'])).toEqual({
      help: false,
      version: true,
      json: true,
      nanoDollars: true
    });
  });

  test('parseCliArgs uses process.argv when no argv is passed', () => {
    const previousArgv = process.argv.slice();

    try {
      process.argv.splice(0, process.argv.length, 'node', 'balance.mjs', '--json', '-n');

      expect(parseCliArgs()).toEqual({
        help: false,
        version: false,
        json: true,
        nanoDollars: true
      });
    } finally {
      process.argv.splice(0, process.argv.length, ...previousArgv);
    }
  });
});
