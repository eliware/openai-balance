# Release Notes

## 1.1.2 - 2026-08-24

- Aligned test, lint, packaging, documentation, and CI workflows with the
  shared conventions.
- Migrated baseline testing and linting to `@eliware/test`, with 100×4
  coverage enforcement and zero-warning lint checks.
- Added Node.js 26 engine metadata, explicit package exports, and a package
  file allowlist.
- Added portable Ubuntu and Windows CI validation, production dependency
  auditing, and package dry-run validation.
- Separated publishing into a single gated Ubuntu job to prevent duplicate
  publishes from the platform matrix.
- Added user-level configuration at `~/.openai-balance/.env`, with documented
  configuration precedence and bearer-token safety guidance.
- Added validation for non-finite balances and malformed credit history
  values.
- Sanitized unexpected error messages to preserve single-line CLI errors.
- Added an ISO 8601 UTC timestamp to normal balance output.
- Expanded regression tests for configuration precedence, malformed API data,
  timestamped output, and cross-platform CLI behavior.
- Corrected scoped `npx` usage and synchronized project guidance with the
  user-level configuration and timestamped output behavior.

## 1.1.1 - 2026-07-11

- Added combined USD/nano-dollar output.
- Added credit history summary tables.
- Added grouped short flags and CLI validation for invalid options and conflicting nano/combined flags.
- Expanded tests for the new CLI modes.

## 1.1.0 - 2026-07-11

- Split the CLI into focused modules under src/.
- Added help, version, JSON, and nano-dollar output modes.
- Expanded Jest coverage for the new helpers and entrypoint behavior.

## 1.0.5 - 2026-07-11

- Release notes sync only.

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

- Accidental release tag with half-baked code. Superseded by 1.0.1.
