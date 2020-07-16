import signToken from "./auth";
import * as localDs from "./DataStorage";
import SecureEnclave from "../secureEnclave/SecureEnclave";

describe("signToken tests", () => {
  it("should throw an error when no DID is returned", async () => {
    expect.assertions(1);
    await expect(signToken("a ticket", "a password")).rejects.toThrow(
      "No DID found on Local Storage."
    );
  });

  it("should return a token signed", async () => {
    expect.assertions(1);
    jest
      .spyOn(localDs, "getDID")
      .mockReturnValue("did:ebsi:0x16048B83FAdaCdCB20198ABc45562Df1A3e289aF");
    jest.spyOn(SecureEnclave.Instance, "getPublicKey").mockReturnValue("0x001");
    jest
      .spyOn(SecureEnclave.Instance, "signJwt")
      .mockResolvedValue("a valid token");

    const response = await signToken("a ticket", "a password");
    expect(response).toMatch("a valid token");
    jest.restoreAllMocks();
  });
});
