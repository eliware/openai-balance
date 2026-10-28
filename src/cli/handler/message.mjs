import { toOneLineMessage } from "../../one-line-message.mjs";

function formatCliHandlerMessage(message) {
  return `OpenAI credit balance: ${toOneLineMessage(message)}`;
}

export { formatCliHandlerMessage };
