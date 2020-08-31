import { parseJwt, isTokenExpired } from "./JWTHandler";
import * as mocks from "../test/mocks/mocks";
import * as values from "../test/mocks/values";

describe("parser", () => {
  it("should parse the jwt and return a token", () => {
    expect.assertions(1);
    const token = parseJwt(mocks.userJwt);

    expect(JSON.stringify(token)).toBe(JSON.stringify(values.tokenUser));
  });
});

describe("isTokenExpired", () => {
  it("should return true if an empty string is provided", () => {
    expect.assertions(1);
    expect(isTokenExpired("")).toStrictEqual(true);
  });

  it("should return true if null is provided", () => {
    expect.assertions(1);
    expect(isTokenExpired(null)).toStrictEqual(true);
  });

  it("should return true if no exp is provided in the token", () => {
    expect.assertions(1);
    expect(
      isTokenExpired(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
      )
    ).toStrictEqual(true);
  });

  it("should return false if the token is not expired", () => {
    expect.assertions(1);
    expect(
      isTokenExpired(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.Vg30C57s3l90JNap_VgMhKZjfc-p7SoBXaSAy8c28HA"
      )
    ).toStrictEqual(false);
  });
});
