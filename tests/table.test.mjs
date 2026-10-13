import { describe, expect, test } from "@jest/globals";

import { formatTable } from "../src/table.mjs";

describe("table formatting", () => {
  test("aligns rows to the widest value in each column", () => {
    expect(
      formatTable(
        ["Name", "Value"],
        [
          ["a", 1],
          ["long", 22],
        ],
      ),
    ).toBe("Name | Value\n-----|------\na    | 1    \nlong | 22   ");
  });

  test("prints headers and separators when rows are empty", () => {
    expect(formatTable(["Name", "Value"], [])).toBe("Name | Value\n-----|------");
  });
});
