import { getPackageVersionValue } from "./value.mjs";

function parsePackageVersion(contents) {
  const packageJson = JSON.parse(contents);
  return getPackageVersionValue(packageJson);
}

export { parsePackageVersion };
