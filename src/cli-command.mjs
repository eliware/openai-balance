import { formatHelp } from "./help-format.mjs";
import { loadPackageVersion } from "./version-loader.mjs";

async function runCliCommand(flags, { scriptDir, log = console.log } = {}) {
  if (flags.help) {
    log(formatHelp());
    return true;
  }

  if (flags.version) {
    log(await loadPackageVersion({ scriptDir }));
    return true;
  }

  return false;
}

export { runCliCommand };
