import { formatDate } from "../date-format.mjs";
import { formatExpiry } from "../expiry-format.mjs";
import { formatUsd } from "../format-utils.mjs";

function formatUsdRows(grants) {
  return {
    headers: ["Effective", "Expires", "Grant", "Used", "Available"],
    rows: grants.map((grant) => [
      formatDate(grant.effectiveAt),
      formatExpiry(grant.expiresAt),
      formatUsd(grant.granted),
      formatUsd(grant.used),
      formatUsd(grant.available),
    ]),
  };
}

export { formatUsdRows };
