import os from "node:os";
import path from "node:path";
import process from "node:process";

import { loadEnvFile } from "./env.mjs";
import { projectRoot } from "./paths.mjs";

function getConfigValue(name, envFile, envSource = process.env) {
  return envSource[name] ?? envFile[name];
}

async function loadConfigEnvFile({
  cwd = process.cwd(),
  scriptDir = projectRoot,
  homeDir = os.homedir(),
} = {}) {
  const envFiles = [path.join(scriptDir, ".env")];

  if (homeDir) {
    envFiles.push(path.join(homeDir, ".openai-balance", ".env"));
  }

  if (cwd !== scriptDir) {
    envFiles.push(path.resolve(cwd, ".env"));
  }

  const envFile = {};

  for (const filePath of envFiles) {
    Object.assign(envFile, await loadEnvFile(filePath));
  }

  return envFile;
}

export { getConfigValue, loadConfigEnvFile };
