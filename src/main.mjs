import { parseCliArgs } from "./args.mjs";
import { loadConfigEnvFile } from "./config.mjs";
import { getConfigValue } from "./config-values.mjs";
import { validateCliFlags } from "./cli-validation.mjs";
import { runCliCommand } from "./cli-command.mjs";
import { fail } from "./fail.mjs";
import { printOutput } from "./output.mjs";
import { projectRoot } from "./paths.mjs";
import { requestSummary } from "./request.mjs";
import { redactErrorMessage } from "./redaction.mjs";
import { processResponse } from "./response-processing.mjs";

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
