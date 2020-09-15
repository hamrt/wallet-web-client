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
  it("should throw an error if the extension is not .json", async () => {
    expect.assertions(1);
    const keys = new File([], "somekeyfile.txt");
    await expect(importKeys(keys)).rejects.toThrow(
      new Error("Invalid extension. Please upload a JSON file.")
    );
  });

  it("should not throw if the extension is .json", async () => {
    expect.assertions(1);
    const keys = new File([], "somekeyfile.json");
    await expect(importKeys(keys)).resolves.toStrictEqual("");
  });
});
