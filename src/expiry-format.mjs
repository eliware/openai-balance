import { formatDate } from "./date-format.mjs";

function formatExpiry(seconds) {
  return seconds == null ? "never" : formatDate(seconds);
}

export { formatExpiry };
