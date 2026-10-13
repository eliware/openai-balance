import process from "node:process";

import { registerSignals } from "@eliware/common";
import { fetchSummary } from "./fetch-summary.mjs";
import { signalExitCodes } from "./signal-exit-codes.mjs";

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
  const abortController = new AbortController();
  let interrupted = false;
  const lifecycle = registerSignals({
    processObj,
    exit: false,
    shutdownHook: (signalName) => {
      interrupted = true;
      setExitCode(signalExitCodes[signalName]);
      abortController.abort();
    },
  });

  try {
    return await fetchSummary(endpoint, authHeader, {
      signal: abortController.signal,
      fetchFn,
    });
  } catch (error) {
    if (interrupted) return null;
    throw error;
  } finally {
    lifecycle.removeHandlers();
  }
}

export { requestSummary };
