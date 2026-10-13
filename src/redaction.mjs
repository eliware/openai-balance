import { redactText } from "@eliware/common";

function redactErrorMessage(error, authHeader) {
  const message = error?.message || "unexpected error";
  return redactText(String(message), { secrets: authHeader ? [authHeader] : [] });
}

export { redactErrorMessage };
