async function fetchSummary(endpoint, authHeader, { signal, fetchFn = fetch } = {}) {
  return fetchFn(endpoint, {
    headers: { Authorization: authHeader, Accept: "application/json" },
    signal,
  });
}

export { fetchSummary };
