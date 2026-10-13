# Release Notes

## 12.0.0 — 2026-10-13

### Added

- Abort the active request after SIGINT, SIGTERM, or SIGHUP.
- Add end-user guides for setup, configuration, output, and common errors.
- Add shared signal, path, redaction, and process-handler support from `@eliware/common`.
- Add tests for every source module and the supported CLI behavior.

### Changed

- Move the CLI launcher to `bin/openai-balance.mjs`.
- Split request, output, summary, and error work into focused modules.
- Update package checks and CI workflows to use the shared Eliware conventions.
- Update `@eliware/common` and `@eliware/test` to version 12.
- Add the Knit deployment workflow for the canonical package path.
- Add repository specifications and indexes for docs, examples, and specifications.

### Fixed

- Redact credentials from unexpected error messages.
- Return signal-specific exit codes and remove process handlers after each CLI run.

### Breaking changes

- Run `node bin/openai-balance.mjs` to start the CLI from a source checkout.

### Migration

- Use `openai-balance` after package install.
- Use `node bin/openai-balance.mjs` from a source checkout.

### Security

- Keep token values out of error output and process event logs.
- Use placeholder credentials in examples and `.env.example`.

## 2.0.0 — 2026-08-24

### Changed

- Limit GitHub Actions OIDC permission to the publish job.
- Require Ubuntu and Windows checks before tag-based publication.
- Use `npm pack --dry-run` for package checks.
- Keep generated Jest results for local and CI checks.

## 1.1.2 — 2026-08-24

### Added

- Add user-level settings at `~/.openai-balance/.env`.
- Add Ubuntu and Windows CI checks, dependency audits, and package checks.
- Check malformed balance and credit history values.
- Add UTC timestamps to normal balance output.

### Changed

- Use `@eliware/test` for tests and lint checks.
- Add Node.js 26 metadata, package exports, and a package file list.
- Use one gated Ubuntu publish job.
- Print unexpected errors on one line.

### Security

- Limit GitHub Actions OIDC permission to the publish job.
- Explain how to protect bearer tokens.

## 1.1.1 — 2026-07-11

### Added

- Add combined USD and nano-dollar output.
- Add credit history tables and grouped short options.

## 1.1.0 — 2026-07-11

### Added

- Add help, version, JSON, and nano-dollar output options.
- Split the CLI into source modules.

## 1.0.5 — 2026-07-11

### Changed

- Align release notes with package history.

## 1.0.4 — 2026-07-11

### Fixed

- Add repository metadata for npm provenance checks.

## 1.0.3 — 2026-07-11

### Fixed

- Allow npm publication by setting `private` to `false`.

## 1.0.1 — 2026-07-11

### Added

- Add a CLI that prints the current OpenAI credit balance.
- Add settings, balance formatting, error handling, and baseline tests.

## 1.0.0 — 2026-07-11

### Breaking changes

- Mark this accidental release as superseded by version 1.0.1.
