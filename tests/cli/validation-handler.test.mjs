import { describe, expect, jest, test } from "@jest/globals";

import { handleCliValidation } from "../../src/cli/validation-handler.mjs";
import { createDefaultFlags } from "../../src/options.mjs";

describe("CLI validation handler", () => {
  test("continues when flags pass validation", () => {
    const reportFailure = jest.fn();
    expect(
      handleCliValidation({ ...createDefaultFlags(), invalidOptions: [] }, reportFailure),
    ).toBe(true);
    expect(reportFailure).not.toHaveBeenCalled();
  });

  test("reports validation errors and stops", () => {
    const reportFailure = jest.fn();
    expect(
      handleCliValidation({ ...createDefaultFlags(), invalidOptions: ["--bad"] }, reportFailure),
    ).toBe(false);
    expect(reportFailure).toHaveBeenCalledWith("invalid option: --bad");
  });
});
