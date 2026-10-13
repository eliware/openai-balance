import os from "node:os";
import process from "node:process";

import { getConfigPaths } from "./config-paths.mjs";
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
  const envFile = {};

  for (const filePath of getConfigPaths({ cwd, scriptDir, homeDir })) {
    Object.assign(envFile, await loadEnvFile(filePath));
  }

  return envFile;
}

export { getConfigValue, loadConfigEnvFile };
