import { describe, expect, test } from "@jest/globals";
import path from "node:path";

import { loadConfigEnvFile } from "../src/config.mjs";

describe("configuration loading", () => {
  test("applies script, home, and working directory precedence", async () => {
    const cwd = path.resolve("work");
    const scriptDir = path.resolve("script");
    const homeDir = path.resolve("home");
    const files = new Map([
      [
        path.join(scriptDir, ".env"),
        { ENDPOINT: "https://script.example.com", AUTH_HEADER: "script" },
      ],
      [path.join(homeDir, ".openai-balance", ".env"), { AUTH_HEADER: "home" }],
      [path.join(cwd, ".env"), { AUTH_HEADER: "cwd" }],
    ]);
    const loadFile = async (filePath) => files.get(filePath) ?? {};

    await expect(loadConfigEnvFile({ cwd, scriptDir, homeDir, loadFile })).resolves.toEqual({
      ENDPOINT: "https://script.example.com",
      AUTH_HEADER: "cwd",
    });
    await expect(
      loadConfigEnvFile({ cwd: scriptDir, scriptDir, homeDir, loadFile }),
    ).resolves.toEqual({ ENDPOINT: "https://script.example.com", AUTH_HEADER: "home" });
  });

  test("supports one shared directory without home config", async () => {
    const dir = path.resolve("shared");
    const loadFile = async () => ({
      ENDPOINT: "https://same.example.com",
      AUTH_HEADER: "same-token",
    });
    await expect(
      loadConfigEnvFile({ cwd: dir, scriptDir: dir, homeDir: null, loadFile }),
    ).resolves.toEqual({ ENDPOINT: "https://same.example.com", AUTH_HEADER: "same-token" });
  });

  test("uses default paths and file loading", async () => {
    await expect(loadConfigEnvFile()).resolves.toEqual(expect.any(Object));
  });
});
