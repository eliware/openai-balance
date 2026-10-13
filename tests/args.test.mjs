import { describe, expect, test } from "@jest/globals";
import { parseCliArgs } from "../src/args.mjs";

describe("cli args", () => {
  test("parseCliArgs detects help flags", () => {
    expect(parseCliArgs(["-h"])).toEqual({
      help: true,
      version: false,
      json: false,
      nanoDollars: false,
      combined: false,
      summary: false,
      invalidOptions: [],
    });
    expect(parseCliArgs(["--help"])).toEqual({
      help: true,
      version: false,
      json: false,
      nanoDollars: false,
      combined: false,
      summary: false,
      invalidOptions: [],
    });
  });

  test("parseCliArgs detects version, json, nano-dollars, combined, and summary flags", () => {
    expect(parseCliArgs(["--version", "--json", "-n", "-c", "-s"])).toEqual({
      help: false,
      version: true,
      json: true,
      nanoDollars: true,
      combined: true,
      summary: true,
      invalidOptions: [],
    });
  });

  test("parseCliArgs expands grouped short flags and records unknown flags", () => {
    expect(parseCliArgs(["-snx"])).toMatchObject({
      nanoDollars: true,
      summary: true,
      invalidOptions: ["-x"],
    });
  });

  test("parseCliArgs records invalid options and deduplicates repeats", () => {
    expect(parseCliArgs([undefined, "", "-", "--", "--wat", "--wat", "foo", "-x"])).toEqual({
      help: false,
      version: false,
      json: false,
      nanoDollars: false,
      combined: false,
      summary: false,
      invalidOptions: ["undefined", "", "-", "--", "--wat", "foo", "-x"],
    });
  });
});
