import fsSync from "node:fs";
import { pathToFileURL } from "node:url";

function toRealFileUrl(filePath) {
  return pathToFileURL(fsSync.realpathSync(filePath)).href;
}

export { toRealFileUrl };
