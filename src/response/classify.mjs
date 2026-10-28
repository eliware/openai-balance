function classifyResponse(response) {
  if (response.status === 401 || response.status === 403) {
    return { error: "invalid bearer token" };
  }
  if (!response.ok) return { error: `request failed (${response.status})` };
  return null;
}

export { classifyResponse };
