import { exportKeys, importKeys } from "./KeysHandler";
import * as localDs from "./DataStorage";
import * as mocks from "../test/mocks/mocks";

describe("exportKeys tests", () => {
  it("should not throw via window.navigator", () => {
    expect.assertions(1);
    jest.spyOn(localDs, "getKeys").mockReturnValue(JSON.stringify(mocks.keys));
    expect(() => exportKeys()).not.toThrow();
  });
});

describe("import keys", () => {
  it("should not throw", () => {
    expect.assertions(1);
    const keys = {
      target: {
        files: [
          {
            name: "somekeyfile.txt",
          },
        ],
      },
    };
    const context = {};
    expect(() => importKeys(keys, context)).not.toThrow();
  });
});
