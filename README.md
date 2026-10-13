# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/openai-balance [![npm](https://img.shields.io/npm/v/@eliware/openai-balance)](https://www.npmjs.com/package/@eliware/openai-balance) [![License](https://img.shields.io/github/license/eliware/openai-balance)](https://github.com/eliware/openai-balance/blob/main/LICENSE) [![CI](https://github.com/eliware/openai-balance/actions/workflows/ci.yaml/badge.svg)](https://github.com/eliware/openai-balance/actions/workflows/ci.yaml)

Display the current OpenAI credit balance in a single terminal line.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [Configuration](#configuration)
- [Operations](#operations)
- [Commands](#commands)
- [Exit codes](#exit-codes)
- [Support](#support)
- [Links](#links)
- [License](#license)

## Features

Read the current credit balance or print credit history from an OpenAI billing endpoint.

## Requirements

Use Node.js 26 or later. Provide an endpoint and a bearer token with access to billing data.

## Setup

Install the package with `npm install @eliware/openai-balance`.

## Usage

Set the required configuration.
Run `npx @eliware/openai-balance`.
Read the [usage guide](docs/usage.md) and [release notes](RELEASE_NOTES.md).

## Development

Read [documentation](docs/README.md), [examples](examples/README.md), and [specifications](specs/README.md).

## Testing

Run `npm test` for aggregate validation.
Run `npm run lint` for lint checks.
Run `npm run format:check` to check formatting.
Run `npm run pack` to check package contents.

## Troubleshooting

Read the [troubleshooting guide](docs/troubleshooting.md) when a command fails.

## Security

Keep the bearer token secret. Use a placeholder token in examples.

## Configuration

Set `ENDPOINT` and `AUTH_HEADER` in the shell or in a `.env` file.
Read the [configuration guide](docs/configuration.md) for file paths and value order.

## Operations

The command makes one HTTPS request. It does not change account data.
It stops the active request after SIGINT, SIGTERM, or SIGHUP.

## Commands

Run `openai-balance --help` to show command options.
Run `openai-balance --version` to show the version.
Use `--summary`, `--json`, `--nano-dollars`, or `--combined` to select output.
Do not combine `--nano-dollars` with `--combined`.

## Exit codes

The command returns 0 after success.
The command returns 1 after a configuration, authentication, request, or data error.
It returns 129 after SIGHUP, 130 after SIGINT, and 143 after SIGTERM.

## Support

For help, questions, or to chat with the author and community, visit:

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)[![eliware.org](https://eliware.org/logos/eliware_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

## Links

- [Home Page](https://eliware.org)
- [GitHub Org](https://github.com/eliware)
- [GitHub Repo](https://github.com/eliware/openai-balance)
- [Bug Reports](https://github.com/eliware/openai-balance/issues)
- [npm](https://www.npmjs.com/package/@eliware/openai-balance)
- [Discord](https://discord.gg/M6aTR9eTwN)

## License

[MIT © Eliware](LICENSE)
