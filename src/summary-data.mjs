import { normalizeSummaryGrant } from "./summary-grant.mjs";

function normalizeSummaryGrants(summary) {
  const grants = summary?.grants?.data;
  if (!Array.isArray(grants)) throw new Error("missing credit history");

  return grants.map(normalizeSummaryGrant);
}

export { normalizeSummaryGrants };
