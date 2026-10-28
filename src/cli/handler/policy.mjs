import process from "node:process";
import { formatCliHandlerMessage } from "./message.mjs";

function createCliHandlerPolicy({
  stderr = console.error,
  processObj = process,
  setExitCode = (code) => {
    processObj.exitCode = code;
  },
} = {}) {
  return {
    debug() {},
    warn(message) {
      stderr(formatCliHandlerMessage(message));
    },
    error(message) {
      stderr(formatCliHandlerMessage(message));
      setExitCode(1);
    },
  };
}

export { createCliHandlerPolicy };
