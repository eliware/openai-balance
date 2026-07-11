import { describe, expect, test } from '@jest/globals';

import { formatBalance, formatCombinedBalance, formatHelp, formatNanoDollars, formatSummary } from '../src/format.mjs';
import { readExampleSummary } from './helpers.mjs';

describe('format helpers', () => {
  test('formatBalance renders USD with two decimals', () => {
    expect(formatBalance(10.163356375)).toBe('OpenAI credit balance: $10.16');
  });

  test('formatCombinedBalance renders both USD and nano dollars', () => {
    expect(formatCombinedBalance(10.163356375)).toBe('OpenAI credit balance: $10.16 (10,163,356,375n)');
  });

  test('formatNanoDollars renders comma-separated nano dollars', () => {
    expect(formatNanoDollars(10.163356375)).toBe('OpenAI credit balance: 10,163,356,375n');
  });

  test('formatSummary renders a USD history table by default', async () => {
    const summary = await readExampleSummary();
    const output = formatSummary(summary);

    expect(output).toContain('Effective');
    expect(output).toContain('2026-07-01 | 2027-08-01 | $20.00');
    expect(output).toContain('2026-01-01 | never');
    expect(output).toContain('$8.92');
  });

  test('formatSummary renders a nano-dollar history table when requested', async () => {
    const summary = await readExampleSummary();
    const output = formatSummary(summary, { nanoDollars: true });

    expect(output).toContain('10,000,000,000n');
    expect(output).toContain('8,918,398,675n');
  });

  test('formatSummary renders a combined history table when requested', async () => {
    const summary = await readExampleSummary();
    const output = formatSummary(summary, { combined: true });

    expect(output).toContain('Grant USD');
    expect(output).toContain('Grant n');
    expect(output).toContain('1,081,601,325n');
  });

  test('formatSummary renders a dash for invalid effective dates', () => {
    const summary = {
      grants: {
        data: [
          {
            effective_at: 'not-a-number',
            expires_at: null,
            grant_amount: 1,
            used_amount: 0
          }
        ]
      }
    };

    const output = formatSummary(summary);

    expect(output).toContain('-         | never   | $1.00 | $0.00 | $1.00');
  });

  test('formatSummary rejects missing credit history', () => {
    expect(() => formatSummary({})).toThrow('missing credit history');
  });

  test('formatHelp renders the CLI usage text', () => {
    expect(formatHelp()).toBe([
      'Usage: openai-balance [options]',
      'Options:',
      '  -h, --help           Show this help text',
      '  -v, --version        Show the package version',
      '  -j, --json           Print the full API response as pretty JSON',
      '  -n, --nano-dollars   Print the balance in nano dollars',
      '  -c, --combined       Print both USD and nano dollars',
      '  -s, --summary        Print the credit history table'
    ].join('\n'));
  });
});
