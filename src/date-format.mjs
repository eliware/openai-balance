function isValidDateSeconds(seconds) {
  if (typeof seconds !== "number" || !Number.isFinite(seconds)) return false;
  const date = new Date(seconds * 1000);
  return !Number.isNaN(date.getTime());
}

function formatDate(seconds) {
  if (!isValidDateSeconds(seconds)) return "-";

  return new Date(seconds * 1000).toISOString().slice(0, 10);
}

export { formatDate, isValidDateSeconds };
