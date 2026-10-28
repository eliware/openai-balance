# Configuration

The command needs `ENDPOINT` and `AUTH_HEADER` before it sends a request.
It has no default endpoint or token.

## Values

| Name          | Required | Value                                                            |
| ------------- | -------- | ---------------------------------------------------------------- |
| `ENDPOINT`    | Yes      | HTTPS URL on `api.openai.com` for a billing endpoint.            |
| `AUTH_HEADER` | Yes      | Authorization header with the `Bearer` scheme and a valid token. |

Use this endpoint as a starting point:

```text
https://api.openai.com/v1/dashboard/billing/credit_grants
```

The endpoint must accept the request and return JSON. The command does not create or grant token access.
Use `api.openai.com` as the host to keep the bearer token on the OpenAI API.

## Environment variables

Set both values in the shell before you run the command:

```sh
export ENDPOINT='https://api.openai.com/v1/dashboard/billing/credit_grants'
export AUTH_HEADER='Bearer your-token-here'
openai-balance
```

Shell values replace `.env` values.

## `.env` files

The command reads these files, in this order:

1. The package directory `.env` file.
2. The home file `~/.openai-balance/.env`.
3. The current directory `.env` file, when it differs from the package directory.

Later file values replace earlier file values. Shell values replace all file values.
The command ignores a missing file.

Create a `.env` file with these placeholder values:

```dotenv
ENDPOINT=https://api.openai.com/v1/dashboard/billing/credit_grants
AUTH_HEADER=Bearer your-token-here
```

The parser skips blank lines and lines that start with `#`.
It reads each other line at the first `=` character. It trims spaces around keys and values.
It removes one matching pair of single or double quotes around a value.
It does not expand shell variables or parse inline comments.

## Credential safety

Replace `your-token-here` with a valid token outside source control.
Do not commit `.env` files. Keep valid tokens out of command history and logs.
Use `.env.example` only as a template with placeholder values.
If a token appears on a public site, revoke it and create a new token.
