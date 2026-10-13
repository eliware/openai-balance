import { formatNanoValue, formatUsd } from "./format-utils.mjs";
import { normalizeSummaryGrants } from "./summary-data.mjs";
import { formatTable } from "./table.mjs";

function formatDate(seconds) {
  if (typeof seconds !== "number" || Number.isNaN(seconds)) {
    return "-";
  }

  return new Date(seconds * 1000).toISOString().slice(0, 10);
}

function formatExpiry(seconds) {
  return seconds == null ? "never" : formatDate(seconds);
}

function formatSummary(summary, { combined = false, nanoDollars = false } = {}) {
  const grants = normalizeSummaryGrants(summary);
  const rows = grants.map((grant) => {
    if (combined) {
      return [
        formatDate(grant.effectiveAt),
        formatExpiry(grant.expiresAt),
        formatUsd(grant.granted),
        formatNanoValue(grant.granted),
        formatUsd(grant.used),
        formatNanoValue(grant.used),
        formatUsd(grant.available),
        formatNanoValue(grant.available),
      ];
    }
    const formatAmount = nanoDollars ? formatNanoValue : formatUsd;
    return [
      formatDate(grant.effectiveAt),
      formatExpiry(grant.expiresAt),
      formatAmount(grant.granted),
      formatAmount(grant.used),
      formatAmount(grant.available),
    ];
  });

  const headers = combined
    ? [
        "Effective",
        "Expires",
        "Grant USD",
        "Grant n",
        "Used USD",
        "Used n",
        "Available USD",
        "Available n",
      ]
    : ["Effective", "Expires", "Grant", "Used", "Available"];
  return formatTable(headers, rows);
}

export { formatSummary };
