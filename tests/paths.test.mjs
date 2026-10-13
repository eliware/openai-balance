import { describe, expect, test } from "@jest/globals";
import path from "node:path";

import { projectRoot, srcDir } from "../src/paths.mjs";

describe("module paths", () => {
  test("exports the source directory and repository root", () => {
    expect(srcDir).toBe(path.resolve("src"));
    expect(projectRoot).toBe(path.resolve("."));
  });
});
