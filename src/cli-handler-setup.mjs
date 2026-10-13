import process from "node:process";

import { registerCliHandlers } from "./cli-handlers.mjs";

function setupCliHandlers({
  processObj = process,
  stderr = console.error,
  setExitCode = (code) => {
    process.exitCode = code;
  },
} = {}) {
  return {
    setExitCode,
    handlers: registerCliHandlers({ processObj, stderr, setExitCode }),
  };
}

export { setupCliHandlers };
