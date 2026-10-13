import { formatConflictingFlags, formatInvalidOptions } from "./cli-validation-message.mjs";

function validateCliFlags(flags) {
  if (flags.invalidOptions.length > 0) {
    return formatInvalidOptions(flags.invalidOptions);
  }

  if (flags.nanoDollars && flags.combined) return formatConflictingFlags();
  return null;
}

export { validateCliFlags };
