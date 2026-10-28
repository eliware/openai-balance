import { parseCliArgs } from "./args.mjs";
import { loadConfigEnvFile } from "./config.mjs";
import { getConfigValue } from "./config/values.mjs";
import { handleCliValidation } from "./cli/validation-handler.mjs";
import { runCliCommand } from "./cli/command.mjs";
import { getCliArgs } from "./cli/argv.mjs";
import { fail } from "./cli/handler/fail.mjs";
import { isHttpsEndpoint } from "./config/endpoint.mjs";
import { printOutput } from "./output.mjs";
import { projectRoot } from "./paths.mjs";
import { requestSummary } from "./request.mjs";
import { redactErrorMessage } from "./redaction.mjs";
import { processResponse } from "./response-processing.mjs";

async function main({
  processObj = process,
  cwd = processObj.cwd(),
  scriptDir = projectRoot,
  homeDir,
  loadConfig = loadConfigEnvFile,
  envSource = processObj.env,
  fetchFn = fetch,
  log = console.log,
  stderr = console.error,
  now = () => new Date(),
  setExitCode = (code) => {
    processObj.exitCode = code;
  },
  argv = [],
} = {}) {
  let authHeader;
  const reportFailure = (message) => fail(message, stderr, setExitCode);

  try {
    const flags = parseCliArgs(getCliArgs(argv, processObj.argv));

    if (await runCliCommand(flags, { scriptDir, log })) return true;

    if (!handleCliValidation(flags, reportFailure)) return false;

    const envFile = await loadConfig({ cwd, scriptDir, homeDir });
    const endpoint = getConfigValue("ENDPOINT", envFile, envSource);
    authHeader = getConfigValue("AUTH_HEADER", envFile, envSource);

    if (!endpoint || !authHeader) {
      reportFailure("missing ENDPOINT or AUTH_HEADER");
      return false;
    }
    if (!isHttpsEndpoint(endpoint)) {
      reportFailure("ENDPOINT must be a valid HTTPS URL");
      return false;
    }

    const response = await requestSummary(endpoint, authHeader, {
      fetchFn,
      processObj,
      setExitCode,
    });
    if (response === null) return false;

    const result = await processResponse(response);
    if (result.error) {
      reportFailure(result.error);
      return false;
    }

    return printOutput(result.summary, flags, { log, now });
  } catch (error) {
    reportFailure(redactErrorMessage(error, authHeader));
    return false;
  }
}

export { fail, main };
