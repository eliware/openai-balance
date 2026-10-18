import os from "node:os";
import process from "node:process";

import { getConfigPaths } from "./config/paths.mjs";
import { loadEnvFile } from "./env.mjs";
import { projectRoot } from "./paths.mjs";

async function loadConfigEnvFile({
  cwd = process.cwd(),
  scriptDir = projectRoot,
  homeDir = os.homedir(),
  loadFile = loadEnvFile,
} = {}) {
  const envFile = {};

  for (const filePath of getConfigPaths({ cwd, scriptDir, homeDir })) {
    Object.assign(envFile, await loadFile(filePath));
  }

  return envFile;
}

export { loadConfigEnvFile };
