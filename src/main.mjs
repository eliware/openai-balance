import { redactText } from "@eliware/common";
import { parseCliArgs } from "./args.mjs";
import { getConfigValue, loadConfigEnvFile } from "./config.mjs";
import { formatHelp } from "./format.mjs";
import { fail } from "./fail.mjs";
import { printOutput } from "./output.mjs";
import { projectRoot } from "./paths.mjs";
import { requestSummary } from "./request.mjs";
import { loadPackageVersion } from "./version.mjs";

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

    if (flags.invalidOptions.length > 0) {
      reportFailure(
        `invalid option${flags.invalidOptions.length === 1 ? "" : "s"}: ${flags.invalidOptions.join(", ")}`,
      );
      return false;
    }

    if (flags.nanoDollars && flags.combined) {
      reportFailure("can't use both -n and -c");
      return false;
    }

    if (flags.help) {
      log(formatHelp());
      return true;
    }

    if (flags.version) {
      log(await loadPackageVersion({ scriptDir }));
      return true;
    }

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

    if (response.status === 401 || response.status === 403) {
      reportFailure("invalid bearer token");
      return false;
    }

    if (!response.ok) {
      reportFailure(`request failed (${response.status})`);
      return false;
    }

    const summary = await response.json();

    return printOutput(summary, flags, { log, now });
  } catch (error) {
    const message = redactText(error?.message || "unexpected error", {
      secrets: authHeader ? [authHeader] : [],
    });
    reportFailure(message);
    return false;
  }
}

export { fail, main };
