import { normalizeSummaryGrant } from "./summary-grant.mjs";
import { getSummaryGrants } from "./summary-validation.mjs";

function normalizeSummaryGrants(summary) {
  return getSummaryGrants(summary).map(normalizeSummaryGrant);
}

export { normalizeSummaryGrants };
