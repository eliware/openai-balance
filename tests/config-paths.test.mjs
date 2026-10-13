import { describe, expect, test } from "@jest/globals";
import path from "node:path";

import { getConfigPaths } from "../src/config-paths.mjs";

describe("configuration paths", () => {
  test("returns script, home, and working directory paths in precedence order", () => {
    expect(getConfigPaths({ cwd: "work", scriptDir: "script", homeDir: "home" })).toEqual([
      path.join("script", ".env"),
      path.join("home", ".openai-balance", ".env"),
      path.resolve("work", ".env"),
    ]);
  });

  test("omits home and duplicate working directory paths", () => {
    expect(getConfigPaths({ cwd: "script", scriptDir: "script", homeDir: null })).toEqual([
      path.join("script", ".env"),
    ]);
  });
});
