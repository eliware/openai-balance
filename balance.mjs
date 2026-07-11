#!/usr/bin/env node
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

async function loadEnvFile(filePath, readFile = fs.readFile) {
  try {
    const contents = await readFile(filePath, 'utf8');
    const env = {};

    for (const rawLine of contents.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) {
        continue;
      }

      const equalsIndex = line.indexOf('=');
      if (equalsIndex === -1) {
        continue;
      }

      const key = line.slice(0, equalsIndex).trim();
      let value = line.slice(equalsIndex + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      env[key] = value;
    }

    return env;
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return {};
    }
    throw error;
  }
}

function getConfigValue(name, envFile, envSource = process.env) {
  return envSource[name] ?? envFile[name];
}

function extractBalance(summary) {
  const value = summary?.total_available ?? summary?.total_paid_available;
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error('missing balance');
  }

  return value;
}

function formatBalance(amount) {
  return `OpenAI credit balance: $${amount.toFixed(2)}`;
}

function fail(message, stderr = console.error, setExitCode = (code) => {
  process.exitCode = code;
}) {
  stderr(`OpenAI credit balance: ${message}`);
  setExitCode(1);
}

async function loadConfigEnvFile({ cwd = process.cwd(), scriptDir = path.dirname(fileURLToPath(import.meta.url)) } = {}) {
  const envFiles = [path.join(scriptDir, '.env')];

  if (cwd !== scriptDir) {
    envFiles.push(path.resolve(cwd, '.env'));
  }

  const envFile = {};

  for (const filePath of envFiles) {
    Object.assign(envFile, await loadEnvFile(filePath));
  }

  return envFile;
}

async function main({
  cwd = process.cwd(),
  scriptDir = path.dirname(fileURLToPath(import.meta.url)),
  envSource = process.env,
  fetchFn = fetch,
  log = console.log,
  stderr = console.error,
  setExitCode = (code) => {
    process.exitCode = code;
  }
} = {}) {
  try {
    const envFile = await loadConfigEnvFile({ cwd, scriptDir });
    const endpoint = getConfigValue('ENDPOINT', envFile, envSource);
    const authHeader = getConfigValue('AUTH_HEADER', envFile, envSource);

    if (!endpoint || !authHeader) {
      fail('missing ENDPOINT or AUTH_HEADER', stderr, setExitCode);
      return false;
    }

    const response = await fetchFn(endpoint, {
      headers: {
        Authorization: authHeader,
        Accept: 'application/json'
      }
    });

    if (response.status === 401 || response.status === 403) {
      fail('invalid bearer token', stderr, setExitCode);
      return false;
    }

    if (!response.ok) {
      fail(`request failed (${response.status})`, stderr, setExitCode);
      return false;
    }

    const summary = await response.json();
    const balance = extractBalance(summary);
    log(formatBalance(balance));
    return true;
  } catch (error) {
    fail(error?.message || 'unexpected error', stderr, setExitCode);
    return false;
  }
}

function toRealFileUrl(filePath) {
  return pathToFileURL(fsSync.realpathSync(filePath)).href;
}

async function cli({ argv1 = process.argv[1], moduleUrl = import.meta.url, ...mainOptions } = {}) {
  if (argv1 && moduleUrl === toRealFileUrl(argv1)) {
    await main(mainOptions);
    return true;
  }

  return false;
}

await cli();

export { cli, extractBalance, fail, formatBalance, getConfigValue, loadConfigEnvFile, loadEnvFile, main };
