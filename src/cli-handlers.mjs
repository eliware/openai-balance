import process from "node:process";

import { registerHandlers } from "@eliware/common";

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
}

export { registerCliHandlers };
