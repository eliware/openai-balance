import fs from 'node:fs/promises';
import path from 'node:path';

import { projectRoot } from './paths.mjs';

async function loadPackageVersion({ scriptDir = projectRoot } = {}) {
  const contents = await fs.readFile(path.join(scriptDir, 'package.json'), 'utf8');
  const packageJson = JSON.parse(contents);

  if (typeof packageJson.version !== 'string' || !packageJson.version) {
    throw new Error('missing package version');
  }

  return packageJson.version;
}

export { loadPackageVersion };
