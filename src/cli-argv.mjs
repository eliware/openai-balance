import process from "node:process";

function getCliArgs(argv, processArgv = process.argv) {
  return argv ?? processArgv.slice(2);
}

export { getCliArgs };
