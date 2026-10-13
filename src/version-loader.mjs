import fs from "node:fs/promises";
import path from "node:path";

import { projectRoot } from "./paths.mjs";
import { parsePackageVersion } from "./version-data.mjs";

async function loadPackageVersion({ scriptDir = projectRoot } = {}) {
  const contents = await fs.readFile(path.join(scriptDir, "package.json"), "utf8");
  return parsePackageVersion(contents);
}

export { loadPackageVersion };
