import { toOneLineMessage } from "../../one-line-message.mjs";

function fail(message, stderr = console.error, setExitCode, processObj = process) {
  const oneLineMessage = toOneLineMessage(message);
  stderr(`OpenAI credit balance: ${oneLineMessage}`);
  (setExitCode ?? ((code) => (processObj.exitCode = code)))(1);
}

export { fail };
