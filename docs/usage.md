# Usage

## Requirements

Use Node.js 26 or later.
Use npm to install the package or run it with `npx`.
Provide an HTTPS endpoint and a bearer token with access to billing data.

## Install

Install the package for global use:

```sh
npm install --global @eliware/openai-balance
```

Run a one-time command without a global install:

```sh
npx @eliware/openai-balance --help
```

## Configure

Set `ENDPOINT` to the billing API URL. Set `AUTH_HEADER` to the full bearer header.
Use the format `Bearer your-token-here` for `AUTH_HEADER`.
Read [Configuration](configuration.md) for supported `.env` files and value order.

## Run

Run the command with no options to print the current balance:

```sh
openai-balance
```

Run the command with `npx` when you did not install it globally:

```sh
npx @eliware/openai-balance
```

Run `openai-balance --help` to list all options.
Run `openai-balance --version` to print the package version.

## Options

| Option           | Short form | Result                                         |
| ---------------- | ---------- | ---------------------------------------------- |
| `--help`         | `-h`       | Print command help.                            |
| `--version`      | `-v`       | Print the package version.                     |
| `--json`         | `-j`       | Print the full API response as formatted JSON. |
| `--nano-dollars` | `-n`       | Print the balance in nano dollars.             |
| `--combined`     | `-c`       | Print the balance in USD and nano dollars.     |
| `--summary`      | `-s`       | Print credit history as a table.               |

Combine short options when they do not conflict. Use `-sn` to print the summary in nano dollars.
Do not combine `-n` and `-c`. The command rejects this combination.
Summary mode takes priority over JSON mode when both options appear.

## Output

Default output contains an ISO 8601 UTC time and the balance in USD.
USD values have two decimal places. Nano-dollar values equal USD multiplied by one billion.
JSON mode prints the full response body. It does not add a timestamp.
Summary mode reads the `grants.data` array and prints grant, used, and available values.
Summary rows show effective and expiry dates. A null expiry value displays as `never`.

Balance mode needs a numeric `total_available` or `total_paid_available` field.
Summary mode needs numeric `grant_amount` and `used_amount` fields for each grant.

## Request and shutdown

The command sends one HTTPS request to `ENDPOINT`.
It sends `AUTH_HEADER` as the `Authorization` header and requests JSON data.
The command does not change billing settings or credit data.
Press Ctrl+C to stop the command. The command aborts its active request after SIGINT, SIGTERM, or SIGHUP.

## Exit codes

| Code  | Meaning                                                          |
| ----- | ---------------------------------------------------------------- |
| `0`   | The command completed successfully.                              |
| `1`   | Configuration, authentication, request, or response data failed. |
| `129` | The command received SIGHUP.                                     |
| `130` | The command received SIGINT.                                     |
| `143` | The command received SIGTERM.                                    |

## Examples

Use a shell variable for one command:

```sh
ENDPOINT=https://api.openai.com/v1/dashboard/billing/credit_grants \
AUTH_HEADER='Bearer your-token-here' \
npx @eliware/openai-balance --summary
```

Use the `.env` file guide to store values outside command history.
Never put a real token in source control, examples, screenshots, or logs.
