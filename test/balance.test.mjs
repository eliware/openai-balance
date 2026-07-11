import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import { extractBalance, formatBalance, loadEnvFile } from '../balance.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cliPath = path.join(repoRoot, 'balance.mjs');

function runCli(env, cwd = repoRoot) {
  return runCliWithArgs([cliPath], env, cwd);
}

function runCliWithArgs(args, env, cwd = repoRoot) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, args, {
      cwd,
      env: { ...process.env, ...env },
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });

    child.on('close', (code) => {
      resolve({ code, stdout: stdout.trim(), stderr: stderr.trim() });
    });
  });
}

test('formatBalance renders USD with two decimals', () => {
  assert.equal(formatBalance(10.163356375), 'OpenAI credit balance: $10.16');
});

test('extractBalance prefers total_available', () => {
  assert.equal(extractBalance({ total_available: 10.16, total_paid_available: 99 }), 10.16);
});

test('extractBalance falls back to total_paid_available', () => {
  assert.equal(extractBalance({ total_paid_available: 9.87 }), 9.87);
});

test('extractBalance rejects missing values', () => {
  assert.throws(() => extractBalance({}), /missing balance/);
});

test('loadEnvFile parses comments, blanks, quoted values, and bare lines', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'openai-balance-'));
  const file = path.join(dir, '.env');
  await fs.writeFile(file, 'A=1\nB="hello world"\nC=\'hi\'\nD\n# comment\n\n');

  assert.deepEqual(await loadEnvFile(file), { A: '1', B: 'hello world', C: 'hi' });
});

test('loadEnvFile returns {} for missing files', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'openai-balance-'));
  assert.deepEqual(await loadEnvFile(path.join(dir, 'missing.env')), {});
});

test('loadEnvFile rethrows non-ENOENT errors', async () => {
  await assert.rejects(
    () => loadEnvFile('ignored.env', async () => {
      const error = new Error('no access');
      error.code = 'EACCES';
      throw error;
    }),
    /no access/
  );
});

test('cli prints the balance from the API', async () => {
  const server = createServer((req, res) => {
    if (req.headers.authorization !== 'Bearer test-token') {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'unauthorized' }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ total_available: 10.163356375 }));
  });

  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();

  try {
    const result = await runCli({
      ENDPOINT: `http://127.0.0.1:${port}/balance`,
      AUTH_HEADER: 'Bearer test-token'
    });

    assert.equal(result.code, 0);
    assert.equal(result.stdout, 'OpenAI credit balance: $10.16');
    assert.equal(result.stderr, '');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('cli prints a one-line invalid token error for 401', async () => {
  const server = createServer((req, res) => {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'invalid authentication' }));
  });

  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();

  try {
    const result = await runCli({
      ENDPOINT: `http://127.0.0.1:${port}/balance`,
      AUTH_HEADER: 'Bearer bad-token'
    });

    assert.equal(result.code, 1);
    assert.equal(result.stdout, '');
    assert.equal(result.stderr, 'OpenAI credit balance: invalid bearer token');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('cli prints a one-line invalid token error for 403', async () => {
  const server = createServer((req, res) => {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'forbidden' }));
  });

  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();

  try {
    const result = await runCli({
      ENDPOINT: `http://127.0.0.1:${port}/balance`,
      AUTH_HEADER: 'Bearer bad-token'
    });

    assert.equal(result.code, 1);
    assert.equal(result.stdout, '');
    assert.equal(result.stderr, 'OpenAI credit balance: invalid bearer token');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('cli reports non-OK HTTP errors', async () => {
  const server = createServer((req, res) => {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'server error' }));
  });

  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();

  try {
    const result = await runCli({
      ENDPOINT: `http://127.0.0.1:${port}/balance`,
      AUTH_HEADER: 'Bearer test-token'
    });

    assert.equal(result.code, 1);
    assert.equal(result.stdout, '');
    assert.equal(result.stderr, 'OpenAI credit balance: request failed (500)');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('cli reports missing config', async () => {
  const result = await runCli({}, await fs.mkdtemp(path.join(os.tmpdir(), 'openai-balance-empty-')));
  assert.equal(result.code, 1);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, 'OpenAI credit balance: missing ENDPOINT or AUTH_HEADER');
});

test('cli reports missing balance in the response', async () => {
  const server = createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ object: 'credit_summary' }));
  });

  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();

  try {
    const result = await runCli({
      ENDPOINT: `http://127.0.0.1:${port}/balance`,
      AUTH_HEADER: 'Bearer test-token'
    });

    assert.equal(result.code, 1);
    assert.equal(result.stdout, '');
    assert.equal(result.stderr, 'OpenAI credit balance: missing balance');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('cli falls back to a generic unexpected error message', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'openai-balance-preload-'));
  const preload = path.join(dir, 'preload.mjs');
  await fs.writeFile(preload, "globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => { throw {}; } });\n");

  const result = await runCliWithArgs(['--import', preload, cliPath], {
    ENDPOINT: 'https://example.com',
    AUTH_HEADER: 'Bearer test-token'
  }, dir);

  assert.equal(result.code, 1);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, 'OpenAI credit balance: unexpected error');
});
