# Release Notes

## 15.0.1 — 2026-10-28

### Changed

- Set the package and both Eliware dependencies to 15.0.1.
- Keep CLI, configuration, output, summary, and version modules in named folders.
- Align package files, specifications, documentation, and workflows with Eliware Test 15.
- Update CI to fetch full history and use the current GitHub actions.
- Use the canonical npm publication workflow and required Knit commands.
- Inject process and file access in tests to isolate external effects.

## 12.0.0 — 2026-10-13

### Added

- Abort active requests after SIGINT, SIGTERM, or SIGHUP.
- Add setup, configuration, usage, and troubleshooting guides.
- Add an example, repository specifications, and documentation indexes.
- Use shared path, redaction, and signal APIs from `@eliware/common`.
- Add focused tests for source modules and CLI behavior.

### Changed

- Move the CLI launcher to `bin/openai-balance.mjs`.
- Split CLI, configuration, request, output, summary, and error tasks into focused modules.
- Require numeric balance data for JSON output.
- Require valid grant dates before summary output.
- Require a valid HTTPS URL for `ENDPOINT` before sending credentials.
- Ignore invalid environment variable names in `.env` files.
- Update package checks and CI workflows to use Eliware conventions.
- Update `@eliware/common` and `@eliware/test` to version 12.
- Add the Knit deployment workflow for `/eliware/openai-balance`.

### Fixed

- Return a direct error for invalid balance and grant data.
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

- Add user-level configuration at `~/.openai-balance/.env`.
- Add Ubuntu and Windows CI checks, dependency audits, and package checks.
- Check malformed balance and credit history values.
- Add UTC timestamps to standard balance output.

### Changed

- Use `@eliware/test` for tests and lint checks.
- Add Node.js 26 metadata, package exports, and a package file list.
- Use one gated Ubuntu publish job.
- Print unexpected errors on one line.

### Security

- Limit GitHub Actions OIDC permission to the publish job.
- Show how to prevent bearer token exposure.
