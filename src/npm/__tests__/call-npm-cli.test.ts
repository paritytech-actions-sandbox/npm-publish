import { describe, it } from "vitest";

import * as errors from "../../errors.js";
import * as subject from "../call-npm-cli.js";

describe.concurrent("callNpmCli", () => {
  it("should call npm CLI", async ({ expect }) => {
    const result = await subject.callNpmCli("config", ["list"], {
      environment: {
        npm_config_scope: "@cool-scope",
      },
    });

    expect(result).toEqual({
      successData: expect.objectContaining({
        json: true,
        "ignore-scripts": true,
        scope: "@cool-scope",
      }),
      errorCode: undefined,
      error: undefined,
    });
  });

  it("should return undefined if no JSON in output", async ({ expect }) => {
    const result = await subject.callNpmCli("config", ["get", "scope"], {
      environment: {
        npm_config_scope: "",
      },
    });

    expect(result).toEqual({
      successData: undefined,
      errorCode: undefined,
      error: undefined,
    });
  });

  it("should return error details if error", async ({ expect }) => {
    const result = await subject.callNpmCli("config", [], { environment: {} });

    expect(result).toEqual({
      successData: undefined,
      errorCode: "EUSAGE",
      error: expect.any(errors.NpmCallError),
    });
  });
});
