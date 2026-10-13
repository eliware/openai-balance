function formatDate(seconds) {
  if (typeof seconds !== "number" || Number.isNaN(seconds)) {
    return "-";
  }

  const date = new Date(seconds * 1000);
  if (!Number.isFinite(seconds) || Number.isNaN(date.getTime())) return "-";

  return date.toISOString().slice(0, 10);
}

export { formatDate };
