import process from "node:process";

import { fetchSummary } from "./fetch-summary.mjs";
import { registerRequestCancellation } from "./request-cancellation.mjs";

async function requestSummary(
  endpoint,
  authHeader,
  {
    fetchFn = fetch,
    processObj = process,
    setExitCode = (code) => {
      process.exitCode = code;
    },
  } = {},
) {
  const cancellation = registerRequestCancellation({
    processObj,
    setExitCode,
  });

  try {
    return await fetchSummary(endpoint, authHeader, {
      signal: cancellation.signal,
      fetchFn,
    });
  } catch (error) {
    if (cancellation.wasInterrupted()) return null;
    throw error;
  } finally {
    cancellation.removeHandlers();
  }
}

export { requestSummary };
