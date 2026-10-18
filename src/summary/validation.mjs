function getSummaryGrants(summary) {
  const grants = summary?.grants?.data;
  if (!Array.isArray(grants)) throw new Error("missing credit history");
  return grants;
}

export { getSummaryGrants };
