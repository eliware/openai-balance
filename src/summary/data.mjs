import { normalizeSummaryGrant } from "./grant.mjs";
import { getSummaryGrants } from "./validation.mjs";

function normalizeSummaryGrants(summary) {
  return getSummaryGrants(summary).map(normalizeSummaryGrant);
}

export { normalizeSummaryGrants };
