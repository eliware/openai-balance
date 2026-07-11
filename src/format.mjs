function formatBalance(amount) {
  return `OpenAI credit balance: $${amount.toFixed(2)}`;
}

function formatNanoDollars(amount) {
  const nanoDollars = Math.round(amount * 1_000_000_000);
  return `OpenAI credit balance: ${new Intl.NumberFormat('en-US').format(nanoDollars)}n`;
}

function formatHelp() {
  return [
    'Usage: openai-balance [options]',
    'Options:',
    '  -h, --help           Show this help text',
    '  -v, --version        Show the package version',
    '  -j, --json           Print the full API response as pretty JSON',
    '  -n, --nano-dollars   Print the balance in nano dollars'
  ].join('\n');
}

export { formatBalance, formatHelp, formatNanoDollars };
