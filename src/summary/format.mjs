import { formatCombinedRows } from "./combined.mjs";
import { formatNanoRows } from "./nano.mjs";
import { formatUsdRows } from "./usd.mjs";

function formatSummaryRows(grants, { combined = false, nanoDollars = false } = {}) {
  return combined
    ? formatCombinedRows(grants)
    : nanoDollars
      ? formatNanoRows(grants)
      : formatUsdRows(grants);
}

export { formatSummaryRows };
