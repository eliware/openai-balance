# Release Notes

## 1.0.0 - 2026-07-11

Initial release of openai-balance.

- CLI prints the current OpenAI credit balance on a single line.
- Supports `npm start`, direct execution, and the `openai-balance` bin name.
- Loads configuration from `.env` in the script directory and current working directory.
- Reads `ENDPOINT` and `AUTH_HEADER` for API access.
- Formats balances as USD with two decimal places.
- Handles missing config, auth failures, HTTP errors, and malformed responses with one-line errors.
- Includes Jest coverage for helpers and CLI behavior.
