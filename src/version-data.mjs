function parsePackageVersion(contents) {
  const packageJson = JSON.parse(contents);
  if (typeof packageJson.version !== "string" || !packageJson.version) {
    throw new Error("missing package version");
  }
  return packageJson.version;
}

export { parsePackageVersion };
