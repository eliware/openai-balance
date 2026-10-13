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

The command reads OpenAI credit data and prints a balance or credit history.

## Requirements

Use Node.js 26 or later. Configure an authorized OpenAI billing endpoint and bearer token.

## Setup

Install the package with `npm install @eliware/openai-balance`.

## Usage

Run `npx @eliware/openai-balance` after you set the required configuration.
Read the [usage guide](docs/usage.md) for setup steps.
Read [release notes](RELEASE_NOTES.md) for user-visible changes.

## Development

Read [documentation](docs/README.md), [examples](examples/README.md), and [specifications](specs/README.md).

## Testing

Run `npm test` for aggregate validation. Run `npm run lint` for lint checks.
Run `npm run format:check` to check formatting. Run `npm run pack` to check package contents.

## Troubleshooting

Read the [troubleshooting guide](docs/troubleshooting.md) for common errors.

## Security

Use a least-privilege bearer token. Rotate the token if you expose it.
Do not put real credentials in examples, logs, screenshots, or command history.

## Configuration

Set `ENDPOINT` and `AUTH_HEADER` in the shell or in a `.env` file.
The command reads shell values first. It then reads the current directory, home configuration, and script directory.
Use `~/.openai-balance/.env` for a user-level configuration file.
Use this endpoint format: `https://api.openai.com/v1/dashboard/billing/credit_grants`.
Use this header format: `Bearer your-session-token-here`.

## Operations

The command makes one HTTPS request to `ENDPOINT`. It does not change account settings or credit data.
Balance output includes a UTC timestamp. JSON and summary output omit the timestamp.
Balance mode needs `total_available` or `total_paid_available`. Summary mode needs `grants.data`.
The command cancels an active request after SIGINT, SIGTERM, or SIGHUP.

## Commands

Run `openai-balance --help` to show command help. Run `openai-balance --version` to show the package version.
Use `--nano-dollars` to print nano dollars. Use `--combined` to print USD and nano dollars.
Use `--summary` to print credit history. Use `--json` to print the API response as JSON.
Combine short flags, such as `-sn`. Do not combine `-n` and `-c`.

## Exit codes

The command returns code 0 after success. It returns code 1 after configuration, authentication, request, or response errors.
It returns code 129 after SIGHUP, 130 after SIGINT, and 143 after SIGTERM.

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
