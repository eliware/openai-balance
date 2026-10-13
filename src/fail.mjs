import { toOneLineMessage } from "./one-line-message.mjs";

function fail(
  message,
  stderr = console.error,
  setExitCode = (code) => {
    process.exitCode = code;
  },
) {
  const oneLineMessage = toOneLineMessage(message);
  stderr(`OpenAI credit balance: ${oneLineMessage}`);
  setExitCode(1);
}

export { fail };
