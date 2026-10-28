import { setupCliHandlers } from "./handler/setup.mjs";
import { main } from "../main.mjs";

async function runCli({ processObj, argv, ...mainOptions }) {
  const { setExitCode, handlers } = setupCliHandlers({ ...mainOptions, processObj });
  try {
    await main({ ...mainOptions, processObj, setExitCode, argv });
  } finally {
    handlers.removeHandlers();
  }
}

export { runCli };
