import { describe, expect, test } from "@jest/globals";
import fs from "node:fs/promises";
import path from "node:path";

import { loadEnvFile } from "../src/env.mjs";
import { withTempDir } from "../test-fixtures/helpers.mjs";

describe("env helpers", () => {
  test("loadEnvFile parses comments, blanks, quoted values, and bare lines", async () => {
    await withTempDir("openai-balance-", async (dir) => {
      const file = path.join(dir, ".env");
      await fs.writeFile(file, "A=1\nB=\"hello world\"\nC='hi'\nD\n# comment\n\n");

      await expect(loadEnvFile(file)).resolves.toEqual({ A: "1", B: "hello world", C: "hi" });
    });
  });

  test("loadEnvFile returns {} for missing files", async () => {
    await withTempDir("openai-balance-", async (dir) => {
      await expect(loadEnvFile(path.join(dir, "missing.env"))).resolves.toEqual({});
    });
  });

  test("loadEnvFile rethrows non-ENOENT errors", async () => {
    await expect(
      loadEnvFile("ignored.env", async () => {
        const error = new Error("no access");
        error.code = "EACCES";
        throw error;
      }),
    ).rejects.toThrow("no access");
  });
});
