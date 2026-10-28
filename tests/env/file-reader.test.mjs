import { describe, expect, test } from "@jest/globals";
import { loadEnvFile } from "../../src/env/file-reader.mjs";

describe("env helpers", () => {
  test("loadEnvFile parses comments, blanks, and bare lines", async () => {
    await expect(loadEnvFile("settings.env", async () => "A=1\n# comment\n\n")).resolves.toEqual({
      A: "1",
    });
  });

  test("loadEnvFile returns {} for missing files", async () => {
    await expect(
      loadEnvFile("missing.env", async () => {
        const error = new Error("missing");
        error.code = "ENOENT";
        throw error;
      }),
    ).resolves.toEqual({});
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
