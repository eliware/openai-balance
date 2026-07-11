function extractBalance(summary) {
  const value = summary?.total_available ?? summary?.total_paid_available;
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error('missing balance');
  }

  return value;
}

export { extractBalance };
