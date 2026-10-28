function normalizeGrantAmounts(grant) {
  const granted = grant.grant_amount;
  const used = grant.used_amount;
  if (
    typeof granted !== "number" ||
    !Number.isFinite(granted) ||
    typeof used !== "number" ||
    !Number.isFinite(used)
  ) {
    throw new Error("malformed credit history");
  }
  return { granted, used };
}

export { normalizeGrantAmounts };
