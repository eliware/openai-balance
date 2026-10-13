import { formatDate, formatExpiry } from "./date-format.mjs";
import { formatNanoValue } from "./format-utils.mjs";

function formatNanoRows(grants) {
  return {
    headers: ["Effective", "Expires", "Grant", "Used", "Available"],
    rows: grants.map((grant) => [
      formatDate(grant.effectiveAt),
      formatExpiry(grant.expiresAt),
      formatNanoValue(grant.granted),
      formatNanoValue(grant.used),
      formatNanoValue(grant.available),
    ]),
  };
}

export { formatNanoRows };
