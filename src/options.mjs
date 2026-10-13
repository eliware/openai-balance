const cliOptions = [
  { name: "help", short: "h", long: "--help", description: "Show this help text" },
  { name: "version", short: "v", long: "--version", description: "Show the package version" },
  {
    name: "json",
    short: "j",
    long: "--json",
    description: "Print the full API response as pretty JSON",
  },
  {
    name: "nanoDollars",
    short: "n",
    long: "--nano-dollars",
    description: "Print the balance in nano dollars",
  },
  {
    name: "combined",
    short: "c",
    long: "--combined",
    description: "Print both USD and nano dollars",
  },
  { name: "summary", short: "s", long: "--summary", description: "Print the credit history table" },
];

function createDefaultFlags() {
  return Object.fromEntries(cliOptions.map(({ name }) => [name, false]));
}

export { cliOptions, createDefaultFlags };
