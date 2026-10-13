async function processResponse(response) {
  if (response.status === 401 || response.status === 403) {
    return { error: "invalid bearer token" };
  }
  if (!response.ok) return { error: `request failed (${response.status})` };
  return { summary: await response.json() };
}

export { processResponse };
