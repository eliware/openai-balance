import process from "node:process";

import { registerHandlers } from "@eliware/common";
import { createCliHandlerPolicy } from "./handler/policy.mjs";

function registerCliHandlers({
  processObj = process,
  stderr = console.error,
  setExitCode = (code) => {
    processObj.exitCode = code;
  },
} = {}) {
  return registerHandlers({
    processObj,
    events: ["uncaughtException", "unhandledRejection", "warning"],
    log: createCliHandlerPolicy({ processObj, stderr, setExitCode }),
  });
}

export { registerCliHandlers };
