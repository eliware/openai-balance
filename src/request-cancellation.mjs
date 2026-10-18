import process from "node:process";
import { registerSignals } from "@eliware/common";
import { signalExitCodes } from "./signal-exit-codes.mjs";

function registerRequestCancellation({
  processObj = process,
  setExitCode = (code) => {
    processObj.exitCode = code;
  },
} = {}) {
  const abortController = new AbortController();
  let interrupted = false;
  const lifecycle = registerSignals({
    processObj,
    exit: false,
    shutdownHook(signalName) {
      interrupted = true;
      setExitCode(signalExitCodes[signalName]);
      abortController.abort();
    },
  });

  return {
    signal: abortController.signal,
    wasInterrupted: () => interrupted,
    removeHandlers: () => lifecycle.removeHandlers(),
  };
}

export { registerRequestCancellation };
