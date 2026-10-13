import { cliOptions, createDefaultFlags } from "./options.mjs";
import { getCliArgs } from "./cli-argv.mjs";

const shortFlagMap = Object.fromEntries(cliOptions.map(({ name, short }) => [short, name]));
const longFlagMap = Object.fromEntries(cliOptions.map(({ name, long }) => [long, name]));

function parseCliArgs(inputArgv) {
  const argv = getCliArgs(inputArgv);
  const flags = createDefaultFlags();
  const invalidOptions = [];
  const addInvalid = (option) => {
    if (!invalidOptions.includes(option)) invalidOptions.push(option);
  };

  for (const token of argv) {
    if (typeof token !== "string" || token.length === 0 || token === "-") {
      addInvalid(String(token));
      continue;
    }

    if (!token.startsWith("-")) {
      addInvalid(token);
      continue;
    }

    if (token === "--") {
      addInvalid(token);
      continue;
    }

    if (token.startsWith("--")) {
      const flagName = longFlagMap[token];
      if (flagName) {
        flags[flagName] = true;
      } else {
        addInvalid(token);
      }
      continue;
    }

    for (const shortFlag of token.slice(1)) {
      const flagName = shortFlagMap[shortFlag];
      if (flagName) flags[flagName] = true;
      else addInvalid(`-${shortFlag}`);
    }
  }

  return {
    ...flags,
    invalidOptions,
  };
}

export { parseCliArgs };
