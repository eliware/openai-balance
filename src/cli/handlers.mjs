import process from "node:process";

import { registerHandlers } from "@eliware/common";
import { createCliRegistrationPolicy } from "./handler/registration-policy.mjs";

function registerCliHandlers({
  processObj = process,
  stderr = console.error,
  setExitCode = (code) => {
    processObj.exitCode = code;
  },
} = {}) {
  return registerHandlers({
    processObj,
    ...createCliRegistrationPolicy({ processObj, stderr, setExitCode }),
  });
}

export { registerCliHandlers };
