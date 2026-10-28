import { formatCliHandlerMessage } from "./message.mjs";

function fail(message, stderr = console.error, setExitCode, processObj = process) {
  stderr(formatCliHandlerMessage(message));
  (setExitCode ?? ((code) => (processObj.exitCode = code)))(1);
}

export { fail };
