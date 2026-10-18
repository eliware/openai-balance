import { normalizeGrantAmounts } from "./grant-amounts.mjs";
import { isValidDateSeconds } from "../date-format.mjs";

function normalizeSummaryGrant(grant) {
  if (!isValidDateSeconds(grant.effective_at)) {
    throw new Error("malformed credit history");
  }
  if (grant.expires_at !== null && !isValidDateSeconds(grant.expires_at)) {
    throw new Error("malformed credit history");
  }
  const { granted, used } = normalizeGrantAmounts(grant);

  return {
    effectiveAt: grant.effective_at,
    expiresAt: grant.expires_at,
    granted,
    used,
    available: granted - used,
  };
}

export { normalizeSummaryGrant };
