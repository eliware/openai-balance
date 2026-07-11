import fsSync from 'node:fs';
import { pathToFileURL } from 'node:url';

import { main } from './main.mjs';

function toRealFileUrl(filePath) {
  return pathToFileURL(fsSync.realpathSync(filePath)).href;
}

async function cli({ argv1 = process.argv[1], moduleUrl = import.meta.url, ...mainOptions } = {}) {
  if (argv1 && moduleUrl === toRealFileUrl(argv1)) {
    await main(mainOptions);
    return true;
  }

  return false;
}

export { cli, toRealFileUrl };
