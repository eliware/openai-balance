import fsSync from "node:fs";
import { pathToFileURL } from "node:url";

function toRealFileUrl(filePath) {
  return pathToFileURL(fsSync.realpathSync(filePath)).href;
}

function isCliEntryPoint(argv1, moduleUrl) {
  return Boolean(argv1 && moduleUrl === toRealFileUrl(argv1));
}

export { isCliEntryPoint, toRealFileUrl };
