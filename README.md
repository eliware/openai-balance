# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/openai-balance [![npm version](https://img.shields.io/npm/v/@eliware/openai-balance.svg)](https://www.npmjs.com/package/@eliware/openai-balance)[![build status](https://github.com/eliware/openai-balance/actions/workflows/nodejs.yml/badge.svg)](https://github.com/eliware/openai-balance/actions)

Prints the current OpenAI credit balance on a single line.

Usage:
- npm start
- ./balance.mjs
- npx openai-balance

Options:
- -n, --nano-dollars: print the balance in nano dollars, with commas and an n suffix
- -v, --version: print the package.json version
- -j, --json: print the full API response as pretty JSON
- -h, --help: show a short help message

Configuration:
- ENDPOINT
- AUTH_HEADER

Precedence:
1. Shell environment variables
2. .env in the current working directory
3. .env in the script directory

Example .env:
- ENDPOINT=https://api.openai.com/v1/dashboard/billing/credit_grants
- AUTH_HEADER=Bearer your-session-token-here

Output:
- Success: OpenAI credit balance: $10.16
- Nano dollars: OpenAI credit balance: 10,160,000,000n
- Version: current package.json version
- JSON: pretty-printed API response body
- Auth failure: OpenAI credit balance: invalid bearer token
- Other errors: one-line OpenAI credit balance: ... message

The API response should include total_available or total_paid_available.
