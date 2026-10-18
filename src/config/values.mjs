import process from "node:process";

function getConfigValue(name, envFile, envSource = process.env) {
  return envSource[name] ?? envFile[name];
}

export { getConfigValue };
