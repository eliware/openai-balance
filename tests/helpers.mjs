import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

async function readPackageVersion(scriptDir = repoRoot) {
  const contents = await fs.readFile(path.join(scriptDir, 'package.json'), 'utf8');
  return JSON.parse(contents).version;
}

async function readExampleSummary(scriptDir = repoRoot) {
  const contents = await fs.readFile(path.join(scriptDir, 'tests/example.json'), 'utf8');
  return JSON.parse(contents);
}

function makeResponse({ status = 200, ok = true, json }) {
  return {
    status,
    ok,
    json
  };
}

export { cliPath, createRecorder, makeResponse, readExampleSummary, readPackageVersion, repoRoot, withTempDir, writeEnv };
