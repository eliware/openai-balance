# AGENTS.md

## Project

Build `@eliware/openai-balance` with Node.js 26 or later. Use native ESM.

## Scope and boundaries

Keep this utility read-only. Do not publish, deploy, or change account data during validation.
Require release approval before you publish a package.

## Layout

Keep source modules under `src/`. Keep launchers under `bin/`.
Keep tests under `tests/`, test support under `test-fixtures/`, and examples under `examples/`.
Mirror every `src/*.mjs` file with one same-path `tests/*.test.mjs` file.
Keep source modules under 100 lines and test modules under 200 lines.
Keep documents in indexed folders. Keep one root `.gitignore` file.

## Development

Give each module one clear purpose. Keep launchers thin.
Use shared APIs from `@eliware/common` for redaction and signal handling.
Keep changes focused. Update user documentation and release notes when behavior changes.

## Validation

Use Node.js 26 or later and native ESM.
Run `npm test` for aggregate validation.
Run `npm run lint` for lint checks.
Run `npm run audit` for dependency checks.
Run `npm run format` to format files.
Run `npm run format:check` to check file format.
Run `npm run pack` to check package contents.

## Security

Protect credentials, tokens, secrets, and private data.
Use placeholder credentials in examples. Redact secrets before you print errors.
Do not commit `.env` files. Rotate any token that you expose.

## Changes

Keep documentation current and direct. Report test results and known limits.
Do not treat validation success as release approval.

## Application

The command makes one read-only HTTPS request to the configured endpoint.
It reads `ENDPOINT` and `AUTH_HEADER` from the shell or supported `.env` files.
It cancels the active request after SIGINT, SIGTERM, or SIGHUP.

## CLI

Use `openai-balance --help` to show usage. Use `openai-balance --version` to show the package version.
Use `--nano-dollars`, `--combined`, `--summary`, or `--json` to select output.
Do not combine `-n` and `-c`. Combine other short flags when needed.
Return code 0 after success. Return code 1 after a request or data error.
Return code 129 after SIGHUP, 130 after SIGINT, and 143 after SIGTERM.

## npm publication

The public package is `@eliware/openai-balance`.
Keep package contents limited to files required by supported use.
Use npm provenance. Match the release tag to `package.json.version`.
Run package validation before publication review. Follow the Eliware Operations approval process.
