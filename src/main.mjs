import { parseCliArgs } from "./args.mjs";
import { getConfigValue, loadConfigEnvFile } from "./config.mjs";
import { validateCliFlags } from "./cli-validation.mjs";
import { runCliCommand } from "./cli-command.mjs";
import { fail } from "./fail.mjs";
import { printOutput } from "./output.mjs";
import { projectRoot } from "./paths.mjs";
import { requestSummary } from "./request.mjs";
import { redactErrorMessage } from "./redaction.mjs";
import { readResponseBody } from "./response.mjs";
import { getResponseError } from "./response-status.mjs";

async function main({
  cwd = process.cwd(),
  scriptDir = projectRoot,
  homeDir,
  envSource = process.env,
  fetchFn = fetch,
  processObj = process,
  log = console.log,
  stderr = console.error,
  now = () => new Date(),
  setExitCode = (code) => {
    process.exitCode = code;
  },
  argv = [],
} = {}) {
  let authHeader;
  const reportFailure = (message) => fail(message, stderr, setExitCode);

  try {
    const flags = parseCliArgs(argv);

    const validationError = validateCliFlags(flags);
    if (validationError) {
      reportFailure(validationError);
      return false;
    }

    if (await runCliCommand(flags, { scriptDir, log })) return true;

    const envFile = await loadConfigEnvFile({ cwd, scriptDir, homeDir });
    const endpoint = getConfigValue("ENDPOINT", envFile, envSource);
    authHeader = getConfigValue("AUTH_HEADER", envFile, envSource);

    if (!endpoint || !authHeader) {
      reportFailure("missing ENDPOINT or AUTH_HEADER");
      return false;
    }

    const response = await requestSummary(endpoint, authHeader, {
      fetchFn,
      processObj,
      setExitCode,
    });
    if (response === null) return false;

    const responseError = getResponseError(response);
    if (responseError) {
      reportFailure(responseError);
      return false;
    }

    const summary = await readResponseBody(response);

    return printOutput(summary, flags, { log, now });
  } catch (error) {
    reportFailure(redactErrorMessage(error, authHeader));
    return false;
  }
}

export { fail, main };
