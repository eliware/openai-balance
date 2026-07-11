import process from 'node:process';

function parseCliArgs(argv = process.argv.slice(2)) {
  return {
    help: argv.includes('-h') || argv.includes('--help'),
    version: argv.includes('-v') || argv.includes('--version'),
    json: argv.includes('-j') || argv.includes('--json'),
    nanoDollars: argv.includes('-n') || argv.includes('--nano-dollars')
  };
}

export { parseCliArgs };
