import process from "node:process";

import { registerCliHandlers } from "../handlers.mjs";

function setupCliHandlers({
  processObj = process,
  stderr = console.error,
  setExitCode = (code) => {
    processObj.exitCode = code;
  },
} = {}) {
  return {
    setExitCode,
    handlers: registerCliHandlers({ processObj, stderr, setExitCode }),
  };
}

export { setupCliHandlers };
