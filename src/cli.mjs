import fsSync from "node:fs";
import { pathToFileURL } from "node:url";

import { registerHandlers } from "@eliware/common";
import { main } from "./main.mjs";

function toRealFileUrl(filePath) {
  return pathToFileURL(fsSync.realpathSync(filePath)).href;
}

async function cli({
  argv1 = process.argv[1],
  moduleUrl = import.meta.url,
  argv = [],
  ...mainOptions
} = {}) {
  if (argv1 && moduleUrl === toRealFileUrl(argv1)) {
    const stderr = mainOptions.stderr ?? console.error;
    const setExitCode =
      mainOptions.setExitCode ??
      ((code) => {
        process.exitCode = code;
      });
    const handlers = registerHandlers({
      events: ["uncaughtException", "unhandledRejection", "warning"],
      log: {
        debug() {},
        warn(message) {
          stderr(`OpenAI credit balance: ${message}`);
        },
        error(message) {
          stderr(`OpenAI credit balance: ${message}`);
          setExitCode(1);
        },
      },
    });
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
