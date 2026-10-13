function getResponseError(response) {
  if (response.status === 401 || response.status === 403) return "invalid bearer token";
  if (!response.ok) return `request failed (${response.status})`;
  return null;
}

export { getResponseError };
