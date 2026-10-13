import { validateCliFlags } from "./cli-validation.mjs";

function handleCliValidation(flags, reportFailure) {
  const validationError = validateCliFlags(flags);
  if (!validationError) return true;
  reportFailure(validationError);
  return false;
}

export { handleCliValidation };
