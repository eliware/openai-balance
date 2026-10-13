import path from "node:path";

function getConfigPaths({ cwd, scriptDir, homeDir }) {
  const paths = [path.join(scriptDir, ".env")];
  if (homeDir) paths.push(path.join(homeDir, ".openai-balance", ".env"));
  if (cwd !== scriptDir) paths.push(path.resolve(cwd, ".env"));
  return paths;
}

export { getConfigPaths };
