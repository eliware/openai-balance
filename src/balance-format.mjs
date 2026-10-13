import { formatUsd } from "./format-utils.mjs";
import { formatNanoValue } from "./nano-dollar-format.mjs";

function formatBalance(amount) {
  return `OpenAI credit balance: ${formatUsd(amount)}`;
}

function formatCombinedBalance(amount) {
  return `OpenAI credit balance: ${formatUsd(amount)} (${formatNanoValue(amount)})`;
}

function formatNanoDollars(amount) {
  return `OpenAI credit balance: ${formatNanoValue(amount)}`;
}

export { formatBalance, formatCombinedBalance, formatNanoDollars };
