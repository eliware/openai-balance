import { describe, expect, test } from '@jest/globals';

import { makeResponse } from './helpers.mjs';

describe('test helpers', () => {
  test('makeResponse applies default status and ok values', () => {
    expect(makeResponse({ json: async () => ({}) })).toEqual({
      status: 200,
      ok: true,
      json: expect.any(Function)
    });
  });
});
