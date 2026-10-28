import { createCliEventPolicy } from "./event-policy.mjs";

function createCliRegistrationPolicy({ processObj, stderr, setExitCode } = {}) {
  return {
    events: ["uncaughtException", "unhandledRejection", "warning"],
    log: createCliEventPolicy({ processObj, stderr, setExitCode }),
  };
}

export { createCliRegistrationPolicy };
