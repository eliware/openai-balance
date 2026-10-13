import { formatOutput } from "./output-format.mjs";

function printOutput(summary, flags, { log = console.log, now = () => new Date() } = {}) {
  const output = formatOutput(summary, flags);
  if (flags.summary || flags.json) {
    log(output);
    return true;
  }
  log(`${now().toISOString()} ${output}`);
  return true;
}

export { printOutput };
