import { formatCombinedRows } from "./summary-combined.mjs";
import { formatNanoRows } from "./summary-nano.mjs";
import { formatUsdRows } from "./summary-usd.mjs";

function formatSummaryRows(grants, { combined = false, nanoDollars = false } = {}) {
  return combined
    ? formatCombinedRows(grants)
    : nanoDollars
      ? formatNanoRows(grants)
      : formatUsdRows(grants);
}

export { formatSummaryRows };
