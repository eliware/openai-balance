import { formatUsd } from "./format-utils.mjs";
import { formatNanoValue } from "./nano-dollar-format.mjs";
import { formatSummary } from "./summary.mjs";
import { formatHelp } from "./help-format.mjs";

function formatBalance(amount) {
  return `OpenAI credit balance: ${formatUsd(amount)}`;
}

function formatCombinedBalance(amount) {
  return `OpenAI credit balance: ${formatUsd(amount)} (${formatNanoValue(amount)})`;
}

function formatNanoDollars(amount) {
  return `OpenAI credit balance: ${formatNanoValue(amount)}`;
}

export { formatBalance, formatCombinedBalance, formatHelp, formatNanoDollars, formatSummary };
