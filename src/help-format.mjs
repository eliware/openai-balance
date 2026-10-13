import { cliOptions } from "./options.mjs";

function formatHelp() {
  return [
    "Usage: openai-balance [options]",
    "Options:",
    ...cliOptions.map(
      ({ short, long, description }) => `  -${short}, ${long}`.padEnd(23) + description,
    ),
  ].join("\n");
}

export { formatHelp };
