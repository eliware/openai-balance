import process from "node:process";

import { registerHandlers } from "@eliware/common";
import { createCliHandlerPolicy } from "./cli-handler-policy.mjs";

function registerCliHandlers({
  processObj = process,
  stderr = console.error,
  setExitCode = (code) => {
    process.exitCode = code;
  },
} = {}) {
  return registerHandlers({
    processObj,
    events: ["uncaughtException", "unhandledRejection", "warning"],
    log: createCliHandlerPolicy({ stderr, setExitCode }),
  });
}

export { registerCliHandlers };
