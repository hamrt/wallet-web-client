import { strB64dec } from "./strB64dec";
import * as mocks from "../test/mocks/mocks";

describe("util", () => {
  it("should decode base 64", () => {
    expect.assertions(1);
    const decoded = strB64dec(mocks.getVID.data.base64);

    expect(JSON.parse(decoded).id).toMatch(
      "ebsi:type-version-of-the-credential"
    );
  });
});
