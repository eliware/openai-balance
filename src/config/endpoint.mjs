function isHttpsEndpoint(endpoint) {
  try {
    const url = new URL(endpoint);
    return url.protocol === "https:" && url.hostname !== "";
  } catch {
    return false;
  }
}

export { isHttpsEndpoint };
