# Release Notes

## 1.1.0 - 2026-07-11

- Split the CLI into focused modules under src/.
- Added help, version, JSON, and nano-dollar output modes.
- Expanded Jest coverage for the new helpers and entrypoint behavior.

## 1.0.5 - 2026-07-11

Release notes sync only.

## 1.0.4 - 2026-07-11

- Added `repository.url` to `package.json` so npm provenance validation matches GitHub Actions.

## 1.0.3 - 2026-07-11

- Removed `private: true` from `package.json` so the package can publish.

## 1.0.1 - 2026-07-11

Initial release of openai-balance.

- CLI prints the current OpenAI credit balance on a single line.
- Supports `npm start`, direct execution, and the `openai-balance` bin name.
- Loads configuration from `.env` in the script directory and current working directory.
- Reads `ENDPOINT` and `AUTH_HEADER` for API access.
- Formats balances as USD with two decimal places.
- Handles missing config, auth failures, HTTP errors, and malformed responses with one-line errors.
- Includes Jest coverage for helpers and CLI behavior.

## 1.0.0 - 2026-07-11

Accidental release tag with half-baked code. Superseded by 1.0.1.
