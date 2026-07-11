import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { projectRoot } from './paths.mjs';

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

async function loadConfigEnvFile({ cwd = process.cwd(), scriptDir = projectRoot } = {}) {
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

export { getConfigValue, loadConfigEnvFile, loadEnvFile };
