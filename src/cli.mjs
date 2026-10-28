import { isCliEntryPoint, toRealFileUrl } from "./cli/entry.mjs";
import { runCli } from "./cli/runner.mjs";

async function cli({
  processObj = process,
  argv1 = processObj.argv[1],
  moduleUrl = import.meta.url,
  argv = [],
  ...mainOptions
} = {}) {
  if (isCliEntryPoint(argv1, moduleUrl)) {
    await runCli({ ...mainOptions, processObj, argv });
    return true;
  }

  return false;
}

export { cli, toRealFileUrl };
