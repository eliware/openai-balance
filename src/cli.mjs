import { setupCliHandlers } from "./cli-handler-setup.mjs";
import { isCliEntryPoint, toRealFileUrl } from "./cli-entry.mjs";
import { main } from "./main.mjs";

async function cli({
  argv1 = process.argv[1],
  moduleUrl = import.meta.url,
  argv = [],
  ...mainOptions
} = {}) {
  if (isCliEntryPoint(argv1, moduleUrl)) {
    const { setExitCode, handlers } = setupCliHandlers(mainOptions);
    try {
      await main({ ...mainOptions, setExitCode, argv });
      return true;
    } finally {
      handlers.removeHandlers();
    }
  }

  return false;
}

export { cli, toRealFileUrl };
