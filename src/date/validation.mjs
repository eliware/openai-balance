function isValidDateSeconds(seconds) {
  if (typeof seconds !== "number" || !Number.isFinite(seconds)) return false;
  const date = new Date(seconds * 1000);
  return !Number.isNaN(date.getTime());
}

export { isValidDateSeconds };
