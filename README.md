# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/openai-balance [![npm version](https://img.shields.io/npm/v/@eliware/openai-balance.svg)](https://www.npmjs.com/package/@eliware/openai-balance)[![build status](https://github.com/eliware/openai-balance/actions/workflows/nodejs.yml/badge.svg)](https://github.com/eliware/openai-balance/actions)

Prints OpenAI credit information in a terminal-friendly format.

Usage:
- npm start
- ./balance.mjs
- npx @eliware/openai-balance

Options:
- -n, --nano-dollars: print the balance in nano dollars
- -c, --combined: print both USD and nano dollars
- -s, --summary: print the credit history table
- Short flags can be combined, like -sn or -cs.
- -n and -c cannot be used together.
- -v, --version: print the package.json version
- -j, --json: print the full API response as pretty JSON
- -h, --help: show a short help message

Configuration:
- ENDPOINT
- AUTH_HEADER
- Store these values in the shell environment or a local `.env` file. Never
  commit `.env` or expose the bearer token in logs, screenshots, or command
  history.

Precedence:
1. Shell environment variables
2. .env in the current working directory
3. .env in `~/.openai-balance/`
4. .env in the script directory

For a global install, create `~/.openai-balance/.env` (for example,
`C:\Users\you\.openai-balance\.env` on Windows or
`/home/you/.openai-balance/.env` on Linux). Create the directory manually and
restrict the file so it is readable only by your user.

Example .env:
- ENDPOINT=https://api.openai.com/v1/dashboard/billing/credit_grants
- AUTH_HEADER=Bearer your-session-token-here

Output:
- Success: `2026-08-24T12:34:56.789Z OpenAI credit balance: $10.16`
- Combined: `2026-08-24T12:34:56.789Z OpenAI credit balance: $10.16 (10,160,000,000n)`
- Nano dollars: `2026-08-24T12:34:56.789Z OpenAI credit balance: 10,160,000,000n`
- Summary: a table of credit history rows
- Version: current package.json version
- JSON: pretty-printed API response body
- Auth failure: OpenAI credit balance: invalid bearer token
- Other errors: one-line OpenAI credit balance: ... message
- Invalid options: one-line OpenAI credit balance: invalid option(s): ...

The API response should include total_available or total_paid_available for balance mode, and grants.data for summary mode.

Validation:
- `npm test` runs the baseline tests, coverage gate, and lint.
- `npm run lint` runs lint only.
- `npm run pack` previews the files that would be published.

Security and operations:
- Use a least-privilege bearer token and rotate it if it is exposed.
- The command makes one HTTPS request to `ENDPOINT` and exits with status 1
  for configuration, authentication, HTTP, or response errors.
- The normal balance output is timestamped in UTC; `--json` and `--summary`
  provide structured response modes.

## Support

For help, questions, or community chat:

[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)

## License

[MIT © Eli Sterling, eliware.org](LICENSE)

## Links

- [Home Page](https://eliware.org)
- [GitHub Repo](https://github.com/eliware/openai-balance)
- [GitHub Org](https://github.com/eliware)
- [Discord](https://discord.gg/M6aTR9eTwN)
