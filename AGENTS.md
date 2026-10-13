# AGENTS.md

## Project

Build `@eliware/openai-balance` with Node.js 26 or later. Use native ESM.

## Scope and boundaries

Keep this CLI read-only. Do not publish or deploy during validation.

## Layout

Keep source files in `src/`, launchers in `bin/`, tests in `tests/`, fixtures in `test-fixtures/`, and examples in `examples/`.

## Development

Use shared APIs from `@eliware/common` for paths, redaction, and signal handling.

## Validation

Run `npm test` for aggregate validation.
Run `npm run lint` for lint checks.
Run `npm run audit` for dependency checks.
Run `npm run format` to format files.
Run `npm run format:check` to check file format.
Run `npm run pack` to check package contents.

## Security

Protect credentials and tokens. Use placeholder credentials in examples.

## Changes

Update user documentation and release notes for user-visible changes.

## Application

The CLI makes one read-only HTTPS request to the configured endpoint.

## CLI

Use `openai-balance --help` to show command options.
Use `openai-balance --version` to show the package version.

## npm publication

The public package is `@eliware/openai-balance`. Require release approval before publication.
