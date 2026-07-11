import process from 'node:process';

const shortFlagMap = {
  h: 'help',
  v: 'version',
  j: 'json',
  n: 'nanoDollars',
  c: 'combined',
  s: 'summary'
};

const longFlagMap = {
  '--help': 'help',
  '--version': 'version',
  '--json': 'json',
  '--nano-dollars': 'nanoDollars',
  '--combined': 'combined',
  '--summary': 'summary'
};

function parseCliArgs(argv = process.argv.slice(2)) {
  const flags = {
    help: false,
    version: false,
    json: false,
    nanoDollars: false,
    combined: false,
    summary: false
  };
  const invalidOptions = [];

  const addInvalid = (option) => {
    if (!invalidOptions.includes(option)) {
      invalidOptions.push(option);
    }
  };

  for (const token of argv) {
    if (typeof token !== 'string' || token.length === 0 || token === '-') {
      addInvalid(String(token));
      continue;
    }

    if (!token.startsWith('-')) {
      addInvalid(token);
      continue;
    }

    if (token === '--') {
      addInvalid(token);
      continue;
    }

    if (token.startsWith('--')) {
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
      if (flagName) {
        flags[flagName] = true;
      } else {
        addInvalid(`-${shortFlag}`);
      }
    }
  }

  return {
    ...flags,
    invalidOptions
  };
}

export { parseCliArgs };
