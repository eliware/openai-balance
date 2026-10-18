function normalizeGrantAmounts(grant) {
  const granted = Number(grant.grant_amount);
  const used = Number(grant.used_amount);
  if (!Number.isFinite(granted) || !Number.isFinite(used)) {
    throw new Error("malformed credit history");
  }
  return { granted, used };
}

export { normalizeGrantAmounts };
