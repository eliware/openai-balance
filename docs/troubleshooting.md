# Troubleshooting

## The command reports missing configuration

Set both `ENDPOINT` and `AUTH_HEADER`.
Check shell variables and the supported `.env` files in [Configuration](configuration.md).
Check the file name and spelling. Use `AUTH_HEADER`, not only the token value.

## The command reports an invalid bearer token

Check that `AUTH_HEADER` starts with `Bearer ` and contains a valid token.
Check that the token can access the selected billing endpoint.
Check that the shell does not override a valid `.env` value.

## The request fails

Check the endpoint URL and network access.
Check that the endpoint returns a successful HTTP response and a JSON body.
The command sends one request. It does not retry a failed request.
The command prints one error line and redacts credentials from unexpected errors.

## The response has no balance

Balance mode needs numeric `total_available` or `total_paid_available` data.
Ask the endpoint owner to confirm the response format if both fields are absent.

## Credit history is unavailable

Summary mode needs an array at `grants.data`.
Each grant needs numeric `grant_amount` and `used_amount` values.
Use default balance mode if the endpoint does not return grant history.

## The command stops after a signal

SIGINT, SIGTERM, and SIGHUP stop the active request.
Exit codes 130, 143, and 129 identify SIGINT, SIGTERM, and SIGHUP in that order.
Run the command again when the endpoint and network are ready.

## Get help

Run `openai-balance --help` to check option names.
Read the [usage guide](usage.md) for examples and output details.
Read [Support](../README.md#support) to contact the project community.
