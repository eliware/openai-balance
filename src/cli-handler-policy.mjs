import process from "node:process";

function createCliHandlerPolicy({
  stderr = console.error,
  setExitCode = (code) => {
    process.exitCode = code;
  },
} = {}) {
  return {
    debug() {},
    warn(message) {
      stderr(`OpenAI credit balance: ${message}`);
    },
    error(message) {
      stderr(`OpenAI credit balance: ${message}`);
      setExitCode(1);
    },
  };
}

export { createCliHandlerPolicy };
