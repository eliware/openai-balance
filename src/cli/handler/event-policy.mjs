import { formatCliHandlerMessage } from "./message.mjs";
import { createCliExitPolicy } from "./policy.mjs";

function createCliEventPolicy({ stderr = console.error, processObj, setExitCode } = {}) {
  const exitPolicy = createCliExitPolicy({ processObj, setExitCode });
  return {
    debug() {},
    warn(message) {
      stderr(formatCliHandlerMessage(message));
    },
    error(message) {
      stderr(formatCliHandlerMessage(message));
      exitPolicy.setErrorExitCode();
    },
  };
}

export { createCliEventPolicy };
