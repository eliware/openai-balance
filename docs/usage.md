# Usage

Install the package with `npm install @eliware/openai-balance`.

Set `ENDPOINT` to the OpenAI billing endpoint. Set `AUTH_HEADER` to a bearer token.
Store both values in the shell or in a local `.env` file.

Run `npx @eliware/openai-balance` to print the balance.
Run `npx @eliware/openai-balance --summary` to print credit history.
Run `npx @eliware/openai-balance --help` to show all options.

The command makes one read-only HTTPS request. It does not change account data.
Keep real credentials out of examples and documentation.
