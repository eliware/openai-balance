function formatDate(seconds) {
  if (typeof seconds !== "number" || Number.isNaN(seconds)) {
    return "-";
  }

  return new Date(seconds * 1000).toISOString().slice(0, 10);
}

function formatExpiry(seconds) {
  return seconds == null ? "never" : formatDate(seconds);
}

export { formatDate, formatExpiry };
