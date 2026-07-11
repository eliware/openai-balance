import { extractBalance } from './balance.mjs';
import { parseCliArgs } from './args.mjs';
import { getConfigValue, loadConfigEnvFile } from './env.mjs';
import { formatBalance, formatHelp, formatNanoDollars } from './format.mjs';
import { projectRoot } from './paths.mjs';
import { loadPackageVersion } from './version.mjs';

function fail(message, stderr = console.error, setExitCode = (code) => {
  process.exitCode = code;
}) {
  stderr(`OpenAI credit balance: ${message}`);
  setExitCode(1);
}

async function main({
  cwd = process.cwd(),
  scriptDir = projectRoot,
  envSource = process.env,
  fetchFn = fetch,
  log = console.log,
  stderr = console.error,
  setExitCode = (code) => {
    process.exitCode = code;
  },
  argv = process.argv.slice(2)
} = {}) {
  try {
    const flags = parseCliArgs(argv);

    if (flags.help) {
      log(formatHelp());
      return true;
    }

    if (flags.version) {
      log(await loadPackageVersion({ scriptDir }));
      return true;
    }

    const envFile = await loadConfigEnvFile({ cwd, scriptDir });
    const endpoint = getConfigValue('ENDPOINT', envFile, envSource);
    const authHeader = getConfigValue('AUTH_HEADER', envFile, envSource);

    if (!endpoint || !authHeader) {
      fail('missing ENDPOINT or AUTH_HEADER', stderr, setExitCode);
      return false;
    }

    const response = await fetchFn(endpoint, {
      headers: {
        Authorization: authHeader,
        Accept: 'application/json'
      }
    });

    if (response.status === 401 || response.status === 403) {
      fail('invalid bearer token', stderr, setExitCode);
      return false;
    }

    if (!response.ok) {
      fail(`request failed (${response.status})`, stderr, setExitCode);
      return false;
    }

    const summary = await response.json();

    if (flags.json) {
      log(JSON.stringify(summary, null, 2));
      return true;
    }

    const balance = extractBalance(summary);
    log(flags.nanoDollars ? formatNanoDollars(balance) : formatBalance(balance));
    return true;
  } catch (error) {
    fail(error?.message || 'unexpected error', stderr, setExitCode);
    return false;
  }
}

export { fail, main };
