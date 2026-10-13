function validateCliFlags(flags) {
  if (flags.invalidOptions.length > 0) {
    return `invalid option${flags.invalidOptions.length === 1 ? "" : "s"}: ${flags.invalidOptions.join(", ")}`;
  }

  if (flags.nanoDollars && flags.combined) return "can't use both -n and -c";
  return null;
}

export { validateCliFlags };
