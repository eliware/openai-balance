#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

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

function getConfigValue(name, envFile) {
  return process.env[name] ?? envFile[name];
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

function fail(message) {
  console.error(`OpenAI credit balance: ${message}`);
  process.exitCode = 1;
}

async function main() {
  try {
    const envFile = await loadEnvFile(path.resolve(process.cwd(), '.env'));
    const endpoint = getConfigValue('ENDPOINT', envFile);
    const authHeader = getConfigValue('AUTH_HEADER', envFile);

    if (!endpoint || !authHeader) {
      fail('missing ENDPOINT or AUTH_HEADER');
      return;
    }

    const response = await fetch(endpoint, {
      headers: {
        Authorization: authHeader,
        Accept: 'application/json'
      }
    });

    if (response.status === 401 || response.status === 403) {
      fail('invalid bearer token');
      return;
    }

    if (!response.ok) {
      fail(`request failed (${response.status})`);
      return;
    }

    const summary = await response.json();
    const balance = extractBalance(summary);
    console.log(formatBalance(balance));
  } catch (error) {
    fail(error?.message || 'unexpected error');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}

export { extractBalance, formatBalance, loadEnvFile };
