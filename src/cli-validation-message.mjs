function formatInvalidOptions(invalidOptions) {
  return `invalid option${invalidOptions.length === 1 ? "" : "s"}: ${invalidOptions.join(", ")}`;
}

function formatConflictingFlags() {
  return "can't use both -n and -c";
}

export { formatConflictingFlags, formatInvalidOptions };
