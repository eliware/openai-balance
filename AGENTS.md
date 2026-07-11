# AGENTS.md

Project: openai-balance

Purpose:
- Print the current OpenAI credit balance as a single terminal line.
- Default success format: OpenAI credit balance: $10.16
- Auth failures (401/403) print: OpenAI credit balance: invalid bearer token

Files:
- balance.mjs: thin CLI entry point
- src/: CLI parsing, env loading, formatting, version, and main logic
- tests/: Jest coverage for formatting, env loading, CLI behavior, and helpers
- README.md: user-facing usage notes
- RELEASE_NOTES.md: release history and 1.1.0 prep notes
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
- Update RELEASE_NOTES.md for user-visible changes before a version bump.
- Root login shell hook lives in /root/.bash_profile outside this repo.
