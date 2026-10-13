import fs from "node:fs/promises";
import { unquoteEnvValue } from "./env-value.mjs";

async function loadEnvFile(filePath, readFile = fs.readFile) {
  try {
    const contents = await readFile(filePath, "utf8");
    const env = {};

    for (const rawLine of contents.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) {
        continue;
      }

      const equalsIndex = line.indexOf("=");
      if (equalsIndex === -1) {
        continue;
      }

      const key = line.slice(0, equalsIndex).trim();
      const value = unquoteEnvValue(line.slice(equalsIndex + 1).trim());

      env[key] = value;
    }

    return env;
  } catch (error) {
    if (error?.code === "ENOENT") {
      return {};
    }
    throw error;
  }
}

export { loadEnvFile };
