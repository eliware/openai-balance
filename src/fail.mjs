function fail(
  message,
  stderr = console.error,
  setExitCode = (code) => {
    process.exitCode = code;
  },
) {
  const oneLineMessage = String(message).replace(/[\r\n]+/g, " ");
  stderr(`OpenAI credit balance: ${oneLineMessage}`);
  setExitCode(1);
}

export { fail };
