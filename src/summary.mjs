import { formatNanoValue, formatUsd } from "./format-utils.mjs";
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
  const grants = summary?.grants?.data;
  if (!Array.isArray(grants)) throw new Error("missing credit history");

  const rows = grants.map((grant) => {
    const granted = Number(grant.grant_amount);
    const used = Number(grant.used_amount);
    if (!Number.isFinite(granted) || !Number.isFinite(used))
      throw new Error("malformed credit history");
    const available = granted - used;
    if (combined) {
      return [
        formatDate(grant.effective_at),
        formatExpiry(grant.expires_at),
        formatUsd(granted),
        formatNanoValue(granted),
        formatUsd(used),
        formatNanoValue(used),
        formatUsd(available),
        formatNanoValue(available),
      ];
    }
    const formatAmount = nanoDollars ? formatNanoValue : formatUsd;
    return [
      formatDate(grant.effective_at),
      formatExpiry(grant.expires_at),
      formatAmount(granted),
      formatAmount(used),
      formatAmount(available),
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
