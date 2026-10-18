import { formatOutput } from "./output/format.mjs";
import { formatTimestampedOutput } from "./output/timestamp.mjs";

function printOutput(summary, flags, { log = console.log, now = () => new Date() } = {}) {
  const output = formatOutput(summary, flags);
  if (flags.summary || flags.json) {
    log(output);
    return true;
  }
  log(formatTimestampedOutput(output, now));
  return true;
}

export { printOutput };
