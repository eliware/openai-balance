import { extractBalance } from "./balance.mjs";
import {
  formatBalance,
  formatCombinedBalance,
  formatNanoDollars,
  formatSummary,
} from "./format.mjs";

function printOutput(summary, flags, { log = console.log, now = () => new Date() } = {}) {
  if (flags.summary) {
    log(formatSummary(summary, { combined: flags.combined, nanoDollars: flags.nanoDollars }));
    return true;
  }
  if (flags.json) {
    log(JSON.stringify(summary, null, 2));
    return true;
  }
  const balance = extractBalance(summary);
  const output = flags.combined
    ? formatCombinedBalance(balance)
    : flags.nanoDollars
      ? formatNanoDollars(balance)
      : formatBalance(balance);
  log(`${now().toISOString()} ${output}`);
  return true;
}

export { printOutput };
