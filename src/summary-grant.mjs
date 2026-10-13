function normalizeSummaryGrant(grant) {
  const granted = Number(grant.grant_amount);
  const used = Number(grant.used_amount);
  if (!Number.isFinite(granted) || !Number.isFinite(used)) {
    throw new Error("malformed credit history");
  }

  return {
    effectiveAt: grant.effective_at,
    expiresAt: grant.expires_at,
    granted,
    used,
    available: granted - used,
  };
}

export { normalizeSummaryGrant };
