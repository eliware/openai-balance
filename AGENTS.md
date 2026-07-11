# AGENTS.md

Project: openai-balance

Purpose:
- Print the current OpenAI credit balance as a single terminal line.
- Default output format: OpenAI credit balance: $10.16
- On auth failure, print one-line error: OpenAI credit balance: invalid bearer token

Files:
- balance.mjs: CLI entry point and HTTP fetch logic
- test/balance.test.mjs: node:test coverage for formatting, env loading, and CLI behavior
- README.md: user-facing usage notes
- .env: local config only; do not commit secrets

Commands:
- npm start
- npm test
- npm run lint
- ./balance.mjs

Notes:
- Keep output to one line only.
- Prefer small, focused changes.
- If changing CLI behavior, update tests.
- Root login shell hook lives in /root/.bash_profile outside this repo.
