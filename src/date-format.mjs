import { isValidDateSeconds } from "./date/validation.mjs";

function formatDate(seconds) {
  if (!isValidDateSeconds(seconds)) return "-";

  return new Date(seconds * 1000).toISOString().slice(0, 10);
}

export { formatDate };
