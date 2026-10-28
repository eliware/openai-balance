import { createCliHandlerPolicy } from "./policy.mjs";

function createCliRegistrationPolicy({ processObj, stderr, setExitCode } = {}) {
  return {
    events: ["uncaughtException", "unhandledRejection", "warning"],
    log: createCliHandlerPolicy({ processObj, stderr, setExitCode }),
  };
}

export { createCliRegistrationPolicy };
