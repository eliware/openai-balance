import fs from "node:fs/promises";
import path from "node:path";

import { projectRoot } from "../paths.mjs";
import { parsePackageVersion } from "./data.mjs";

async function loadPackageVersion({ scriptDir = projectRoot, readFile = fs.readFile } = {}) {
  const contents = await readFile(path.join(scriptDir, "package.json"), "utf8");
  return parsePackageVersion(contents);
}

export { loadPackageVersion };
