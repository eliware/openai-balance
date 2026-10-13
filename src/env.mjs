import fs from "node:fs/promises";
import { parseEnvContents } from "./env-parser.mjs";

async function loadEnvFile(filePath, readFile = fs.readFile) {
  try {
    const contents = await readFile(filePath, "utf8");
    return parseEnvContents(contents);
  } catch (error) {
    if (error?.code === "ENOENT") {
      return {};
    }
    throw error;
  }
}

export { loadEnvFile };
