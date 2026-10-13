import { formatNanoValue, formatUsd } from "./format-utils.mjs";
import { formatSummary } from "./summary.mjs";

function formatBalance(amount) {
  return `OpenAI credit balance: ${formatUsd(amount)}`;
}

function formatCombinedBalance(amount) {
  return `OpenAI credit balance: ${formatUsd(amount)} (${formatNanoValue(amount)})`;
}

function formatNanoDollars(amount) {
  return `OpenAI credit balance: ${formatNanoValue(amount)}`;
}

function formatHelp() {
  return [
    "Usage: openai-balance [options]",
    "Options:",
    "  -h, --help           Show this help text",
    "  -v, --version        Show the package version",
    "  -j, --json           Print the full API response as pretty JSON",
    "  -n, --nano-dollars   Print the balance in nano dollars",
    "  -c, --combined       Print both USD and nano dollars",
    "  -s, --summary        Print the credit history table",
  ].join("\n");
}

export { formatBalance, formatCombinedBalance, formatHelp, formatNanoDollars, formatSummary };
