import { classifyResponse } from "./response/classify.mjs";

async function processResponse(response) {
  const classification = classifyResponse(response);
  if (classification) return classification;
  return { summary: await response.json() };
}

export { processResponse };
