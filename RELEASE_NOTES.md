# Release Notes

## 12.0.0 — 2026-10-13

### Added

- Added request cancellation for SIGINT, SIGTERM, and SIGHUP.
- Added credential redaction for error output.

### Changed

- Moved the command launcher to `bin/openai-balance.mjs`.
- Updated package metadata and validation workflows for the shared conventions.

### Migration

- Use `node bin/openai-balance.mjs` to run the launcher from a source checkout.
- Use the `openai-balance` command after you install the package.

## 2.0.0 — 2026-08-24

### Changed

- Scoped GitHub Actions OIDC permission to the publish job.
- Required Ubuntu and Windows validation before tag-based publication.
- Standardized package validation on `npm pack --dry-run`.
- Preserved generated Jest results for local and CI diagnostics.

## 1.1.2 — 2026-08-24

### Added

- Added user-level configuration at `~/.openai-balance/.env`.
- Added portable Ubuntu and Windows validation.
- Added production dependency audit and package dry-run validation.
- Added checks for malformed balance and credit history values.

### Changed

- Migrated tests and lint checks to `@eliware/test`.
- Added Node.js 26 engine metadata, package exports, and an explicit package file list.
- Added one gated Ubuntu publishing job.
- Added UTC timestamps to balance output.
- Sanitized error messages to keep CLI errors on one line.

### Security

- Scoped GitHub Actions OIDC permission to the publish job.
- Added guidance to protect bearer tokens.

## 1.1.1 — 2026-07-11

### Added

- Added combined USD and nano-dollar output.
- Added credit history summary tables and grouped short flags.

## 1.1.0 — 2026-07-11

### Added

- Split the CLI into focused modules.
- Added help, version, JSON, and nano-dollar output modes.

## 1.0.5 — 2026-07-11

### Changed

- Synchronized release notes with the package history.

## 1.0.4 — 2026-07-11

### Fixed

- Added repository metadata for npm provenance validation.

## 1.0.3 — 2026-07-11

### Fixed

- Enabled npm publication by removing the private package setting.

## 1.0.1 — 2026-07-11

### Added

- Added a CLI that prints the current OpenAI credit balance.
- Added configuration, balance formatting, error handling, and baseline tests.

## 1.0.0 — 2026-07-11

### Breaking changes

- Replaced the accidental release with version 1.0.1.
