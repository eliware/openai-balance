import process from "node:process";

function createCliExitPolicy({
  processObj = process,
  setExitCode = (code) => {
    processObj.exitCode = code;
  },
} = {}) {
  return {
    setErrorExitCode() {
      setExitCode(1);
    },
  };
}

export { createCliExitPolicy };
