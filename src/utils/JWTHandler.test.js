import { parseJwt } from "./JWTHandler";
import * as mocks from "../test/mocks/mocks";
import * as values from "../test/mocks/values";

describe("parser", () => {
  it("should parse the jwt and return a token", () => {
    expect.assertions(1);
    const token = parseJwt(mocks.userJwt);

    expect(JSON.stringify(token)).toBe(JSON.stringify(values.tokenUser));
  });
});
