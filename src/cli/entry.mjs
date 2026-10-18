import { toRealFileUrl } from "../real-file-url.mjs";

function isCliEntryPoint(argv1, moduleUrl) {
  return Boolean(argv1 && moduleUrl === toRealFileUrl(argv1));
}

export { isCliEntryPoint, toRealFileUrl };
