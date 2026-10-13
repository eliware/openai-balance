import { normalizeGrantAmounts } from "./summary-grant-amounts.mjs";

function normalizeSummaryGrant(grant) {
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
