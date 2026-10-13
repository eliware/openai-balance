import { describe, expect, test } from "@jest/globals";
import fs from "node:fs/promises";
import path from "node:path";

import { getConfigValue, loadConfigEnvFile } from "../src/config.mjs";
import { withTempDir, writeEnv } from "../test-fixtures/helpers.mjs";

describe("configuration loading", () => {
  test("prefers process values and falls back to file values", () => {
    expect(getConfigValue("ENDPOINT", { ENDPOINT: "file-value" }, { ENDPOINT: "env-value" })).toBe(
      "env-value",
    );
    expect(getConfigValue("ENDPOINT", { ENDPOINT: "file-value" }, {})).toBe("file-value");
  });

  test("uses process.env by default", () => {
    const previous = process.env.TEST_BALANCE_CONFIG_VALUE;
    process.env.TEST_BALANCE_CONFIG_VALUE = "env-value";

    try {
      expect(
        getConfigValue("TEST_BALANCE_CONFIG_VALUE", { TEST_BALANCE_CONFIG_VALUE: "file-value" }),
      ).toBe("env-value");
    } finally {
      if (previous === undefined) delete process.env.TEST_BALANCE_CONFIG_VALUE;
      else process.env.TEST_BALANCE_CONFIG_VALUE = previous;
    }
  });

  test("applies script, home, and working directory precedence", async () => {
    await withTempDir("openai-balance-", async (cwd) => {
      await withTempDir("openai-balance-", async (scriptDir) => {
        await withTempDir("openai-balance-", async (homeDir) => {
          await writeEnv(
            scriptDir,
            "ENDPOINT=https://script.example.com\nAUTH_HEADER=Bearer script-token\n",
          );
          await writeEnv(cwd, "AUTH_HEADER=Bearer cwd-token\n");
          await fs.mkdir(path.join(homeDir, ".openai-balance"));
          await fs.writeFile(
            path.join(homeDir, ".openai-balance", ".env"),
            "AUTH_HEADER=Bearer home-token\n",
          );

          await expect(loadConfigEnvFile({ cwd, scriptDir, homeDir })).resolves.toEqual({
            ENDPOINT: "https://script.example.com",
            AUTH_HEADER: "Bearer cwd-token",
          });
          await expect(loadConfigEnvFile({ cwd: scriptDir, scriptDir, homeDir })).resolves.toEqual({
            ENDPOINT: "https://script.example.com",
            AUTH_HEADER: "Bearer home-token",
          });
        });
      });
    });
  });

  test("uses default paths", async () => {
    await expect(loadConfigEnvFile()).resolves.toEqual(expect.any(Object));
  });

  test("supports one shared directory without home config", async () => {
    await withTempDir("openai-balance-", async (dir) => {
      await writeEnv(dir, "ENDPOINT=https://same.example.com\nAUTH_HEADER=Bearer same-token\n");
      await expect(loadConfigEnvFile({ cwd: dir, scriptDir: dir, homeDir: null })).resolves.toEqual(
        {
          ENDPOINT: "https://same.example.com",
          AUTH_HEADER: "Bearer same-token",
        },
      );
    });
  });
});
