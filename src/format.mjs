function formatUsd(amount) {
  return `$${amount.toFixed(2)}`;
}

function formatNanoValue(amount) {
  const nanoDollars = Math.round(amount * 1_000_000_000);
  return `${new Intl.NumberFormat('en-US').format(nanoDollars)}n`;
}

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
    'Usage: openai-balance [options]',
    'Options:',
    '  -h, --help           Show this help text',
    '  -v, --version        Show the package version',
    '  -j, --json           Print the full API response as pretty JSON',
    '  -n, --nano-dollars   Print the balance in nano dollars',
    '  -c, --combined       Print both USD and nano dollars',
    '  -s, --summary        Print the credit history table'
  ].join('\n');
}

function formatDate(seconds) {
  if (typeof seconds !== 'number' || Number.isNaN(seconds)) {
    return '-';
  }

  return new Date(seconds * 1000).toISOString().slice(0, 10);
}

function formatExpiry(seconds) {
  return seconds == null ? 'never' : formatDate(seconds);
}

function formatTable(headers, rows) {
  const widths = headers.map((header, index) => {
    const cellWidths = rows.map((row) => String(row[index]).length);
    return Math.max(header.length, ...cellWidths);
  });

  const renderRow = (row) => row.map((cell, index) => String(cell).padEnd(widths[index])).join(' | ');
  const separator = widths.map((width) => '-'.repeat(width)).join('-|-');

  return [renderRow(headers), separator, ...rows.map(renderRow)].join('\n');
}

function formatSummary(summary, { combined = false, nanoDollars = false } = {}) {
  const grants = summary?.grants?.data;

  if (!Array.isArray(grants)) {
    throw new Error('missing credit history');
  }

  if (combined) {
    const rows = grants.map((grant) => {
      const granted = Number(grant.grant_amount);
      const used = Number(grant.used_amount);
      const available = granted - used;

      return [
        formatDate(grant.effective_at),
        formatExpiry(grant.expires_at),
        formatUsd(granted),
        formatNanoValue(granted),
        formatUsd(used),
        formatNanoValue(used),
        formatUsd(available),
        formatNanoValue(available)
      ];
    });

    return formatTable(
      ['Effective', 'Expires', 'Grant USD', 'Grant n', 'Used USD', 'Used n', 'Available USD', 'Available n'],
      rows
    );
  }

  const useNanoDollars = nanoDollars;
  const formatAmount = useNanoDollars ? formatNanoValue : formatUsd;
  const rows = grants.map((grant) => {
    const granted = Number(grant.grant_amount);
    const used = Number(grant.used_amount);
    const available = granted - used;

    return [
      formatDate(grant.effective_at),
      formatExpiry(grant.expires_at),
      formatAmount(granted),
      formatAmount(used),
      formatAmount(available)
    ];
  });

  return formatTable(['Effective', 'Expires', 'Grant', 'Used', 'Available'], rows);
}

export { formatBalance, formatCombinedBalance, formatHelp, formatNanoDollars, formatSummary };
