function getPackageVersionValue(packageJson) {
  if (typeof packageJson?.version !== "string" || !packageJson.version) {
    throw new Error("missing package version");
  }
  return packageJson.version;
}

export { getPackageVersionValue };
