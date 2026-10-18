import { extractBalance } from "../balance.mjs";
import { formatBalance, formatCombinedBalance, formatNanoDollars } from "../balance-format.mjs";
import { formatSummary } from "../summary.mjs";

function formatOutput(summary, flags) {
  if (flags.summary) {
    return formatSummary(summary, { combined: flags.combined, nanoDollars: flags.nanoDollars });
  }
  if (flags.json) {
    extractBalance(summary);
    return JSON.stringify(summary, null, 2);
  }

  const balance = extractBalance(summary);
  return flags.combined
    ? formatCombinedBalance(balance)
    : flags.nanoDollars
      ? formatNanoDollars(balance)
      : formatBalance(balance);
}

export { formatOutput };
