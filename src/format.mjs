import { formatNanoValue, formatUsd } from "./format-utils.mjs";
import { cliOptions } from "./options.mjs";
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
    ...cliOptions.map(
      ({ short, long, description }) => `  -${short}, ${long}`.padEnd(23) + description,
    ),
  ].join("\n");
}

export { formatBalance, formatCombinedBalance, formatHelp, formatNanoDollars, formatSummary };
