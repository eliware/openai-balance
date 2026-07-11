import { describe, expect, test } from '@jest/globals';
import process from 'node:process';

import { parseCliArgs } from '../src/args.mjs';

describe('cli args', () => {
  test('parseCliArgs detects help flags', () => {
    expect(parseCliArgs(['-h'])).toEqual({ help: true, version: false, json: false, nanoDollars: false, combined: false, summary: false, invalidOptions: [] });
    expect(parseCliArgs(['--help'])).toEqual({ help: true, version: false, json: false, nanoDollars: false, combined: false, summary: false, invalidOptions: [] });
  });

  test('parseCliArgs detects version, json, nano-dollars, combined, and summary flags', () => {
    expect(parseCliArgs(['--version', '--json', '-n', '-c', '-s'])).toEqual({
      help: false,
      version: true,
      json: true,
      nanoDollars: true,
      combined: true,
      summary: true,
      invalidOptions: []
    });
  });

  test('parseCliArgs accepts grouped short flags', () => {
    expect(parseCliArgs(['-sn'])).toEqual({
      help: false,
      version: false,
      json: false,
      nanoDollars: true,
      combined: false,
      summary: true,
      invalidOptions: []
    });
    expect(parseCliArgs(['-ns'])).toEqual({
      help: false,
      version: false,
      json: false,
      nanoDollars: true,
      combined: false,
      summary: true,
      invalidOptions: []
    });
    expect(parseCliArgs(['-sc'])).toEqual({
      help: false,
      version: false,
      json: false,
      nanoDollars: false,
      combined: true,
      summary: true,
      invalidOptions: []
    });
    expect(parseCliArgs(['-cs'])).toEqual({
      help: false,
      version: false,
      json: false,
      nanoDollars: false,
      combined: true,
      summary: true,
      invalidOptions: []
    });
  });

  test('parseCliArgs records invalid options and deduplicates repeats', () => {
    expect(parseCliArgs([undefined, '', '-', '--', '--wat', '--wat', 'foo', '-x'])).toEqual({
      help: false,
      version: false,
      json: false,
      nanoDollars: false,
      combined: false,
      summary: false,
      invalidOptions: ['undefined', '', '-', '--', '--wat', 'foo', '-x']
    });
  });

  test('parseCliArgs uses process.argv when no argv is passed', () => {
    const previousArgv = process.argv.slice();

    try {
      process.argv.splice(0, process.argv.length, 'node', 'balance.mjs', '--json', '-n', '--combined', '--summary');

      expect(parseCliArgs()).toEqual({
        help: false,
        version: false,
        json: true,
        nanoDollars: true,
        combined: true,
        summary: true,
        invalidOptions: []
      });
    } finally {
      process.argv.splice(0, process.argv.length, ...previousArgv);
    }
  });
});
