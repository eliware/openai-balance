# AGENTS.md

Project: openai-balance

Purpose:
- Print the current OpenAI credit balance as a single terminal line.
- Default success format: OpenAI credit balance: $10.16
- Auth failures (401/403) print: OpenAI credit balance: invalid bearer token

Files:
- balance.mjs: CLI entry point and HTTP fetch logic
- test/balance.test.mjs: Jest coverage for formatting, env loading, and CLI behavior
- README.md: user-facing usage notes
- .env.example: sample local config
- .env: local config only; do not commit secrets

Behavior:
- Keep stdout/stderr to one line per run.
- Configuration precedence is shell env > .env in the current working directory > .env in the script directory.
- API responses read total_available first, then total_paid_available.
- Missing config, HTTP errors, malformed responses, and unexpected failures all print one-line errors.

Commands:
- npm start
- npm test
- npm run lint
- ./balance.mjs

Notes:
- Keep changes small and focused.
- If changing CLI behavior, update the Jest tests.
- Keep README.md aligned with the current behavior.
- Root login shell hook lives in /root/.bash_profile outside this repo.
