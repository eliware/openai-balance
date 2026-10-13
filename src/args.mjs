import process from "node:process";

import { cliOptions, createDefaultFlags } from "./options.mjs";
import { createInvalidOptions } from "./invalid-options.mjs";
import { applyShortOptions } from "./short-options.mjs";

const shortFlagMap = Object.fromEntries(cliOptions.map(({ name, short }) => [short, name]));
const longFlagMap = Object.fromEntries(cliOptions.map(({ name, long }) => [long, name]));

function parseCliArgs(argv = process.argv.slice(2)) {
  const flags = createDefaultFlags();
  const invalidOptions = createInvalidOptions();
  const addInvalid = (option) => invalidOptions.add(option);

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

    applyShortOptions(token, flags, shortFlagMap, addInvalid);
  }

  return {
    ...flags,
    invalidOptions: invalidOptions.values,
  };
}

export { parseCliArgs };
