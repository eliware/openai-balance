import { normalizeSummaryGrants } from "./summary/data.mjs";
import { formatTable } from "./table.mjs";
import { formatSummaryRows } from "./summary/format.mjs";

function formatSummary(summary, { combined = false, nanoDollars = false } = {}) {
  const grants = normalizeSummaryGrants(summary);
  const formatted = formatSummaryRows(grants, { combined, nanoDollars });
  return formatTable(formatted.headers, formatted.rows);
}

export { formatSummary };
