import { normalizeSummaryGrants } from "./summary-data.mjs";
import { formatTable } from "./table.mjs";
import { formatCombinedRows } from "./summary-combined.mjs";
import { formatNanoRows } from "./summary-nano.mjs";
import { formatUsdRows } from "./summary-usd.mjs";

function formatSummary(summary, { combined = false, nanoDollars = false } = {}) {
  const grants = normalizeSummaryGrants(summary);
  const formatted = combined
    ? formatCombinedRows(grants)
    : nanoDollars
      ? formatNanoRows(grants)
      : formatUsdRows(grants);
  return formatTable(formatted.headers, formatted.rows);
}

export { formatSummary };
