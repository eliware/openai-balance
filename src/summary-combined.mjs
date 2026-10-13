import { formatDate, formatExpiry } from "./date-format.mjs";
import { formatNanoValue, formatUsd } from "./format-utils.mjs";

function formatCombinedRows(grants) {
  return {
    headers: [
      "Effective",
      "Expires",
      "Grant USD",
      "Grant n",
      "Used USD",
      "Used n",
      "Available USD",
      "Available n",
    ],
    rows: grants.map((grant) => [
      formatDate(grant.effectiveAt),
      formatExpiry(grant.expiresAt),
      formatUsd(grant.granted),
      formatNanoValue(grant.granted),
      formatUsd(grant.used),
      formatNanoValue(grant.used),
      formatUsd(grant.available),
      formatNanoValue(grant.available),
    ]),
  };
}

export { formatCombinedRows };
