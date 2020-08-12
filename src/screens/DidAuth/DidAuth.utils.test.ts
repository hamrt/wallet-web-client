import { EbsiDidAuth } from "@cef-ebsi/did-auth";
import SecureEnclave from "../../secureEnclave/SecureEnclave";
import { createResponse, decryptKeys } from "./DidAuth.utils";

describe("createResponse", () => {
  // eslint-disable-next-line jest/no-hooks
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if the DID is missing", async () => {
    expect.assertions(1);

    await expect(createResponse("nonce", "serviceUrl")).rejects.toThrow(
      new Error("No DID found on Local Storage.")
    );
  });

  it("should throw when the wallet can't be found", async () => {
    expect.assertions(1);

    localStorage.setItem("Did", "did:ebsi:0xabc");

    await expect(createResponse("nonce", "serviceUrl")).rejects.toThrow(
      new Error("Wallet not found")
    );

    localStorage.removeItem("Did");
  });

  it("should redirect the user to the expected url", async () => {
    expect.assertions(3);

    localStorage.setItem("Did", "did:ebsi:0xabc");
    const se = SecureEnclave.Instance;

    const mockedGetPrivateKey = jest
      .spyOn(se, "getPrivateKey")
      .mockImplementation(() => "privateKey");

    const mockedCreateDidAuthResponse = jest
      .spyOn(EbsiDidAuth, "createDidAuthResponse")
      .mockImplementation(async () => "jwt");

    const mockedLocationAssign = jest
      .spyOn(window.location, "replace")
      .mockImplementation(() => {});

    await createResponse("nonce", "serviceUrl");

    expect(mockedGetPrivateKey).toHaveBeenCalledWith("did:ebsi:0xabc");
    expect(mockedCreateDidAuthResponse).toHaveBeenCalledWith({
      hexPrivatekey: "privateKey",
      did: "did:ebsi:0xabc",
      nonce: "nonce",
      redirectUri: "serviceUrl",
    });
    expect(mockedLocationAssign).toHaveBeenCalledWith(
      "serviceUrl?response=jwt"
    );

    localStorage.removeItem("Did");
  });
});

describe("decryptKeys", () => {
  // eslint-disable-next-line jest/no-hooks
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if the keys are missing", async () => {
    expect.assertions(1);

    await expect(decryptKeys("password")).rejects.toThrow(
      new Error("No keys found.")
    );
  });

  it("should decrypt the keys with the given password", async () => {
    expect.assertions(1);

    localStorage.setItem("Keys", "keys");

    const mockedRestoreWallet = jest
      .spyOn(SecureEnclave.Instance, "restoreWallet")
      .mockImplementation();

    await decryptKeys("password");

    expect(mockedRestoreWallet).toHaveBeenCalledWith({
      encryptedKey: "keys",
      password: "password",
    });

    localStorage.removeItem("Keys");
  });
});
