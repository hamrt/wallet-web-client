import * as LoginUtils from "./Login.utils";
import SecureEnclave from "../../secureEnclave/SecureEnclave";
import * as DataStorage from "../../utils/DataStorage";
import * as Auth from "../../utils/auth";
import * as wallet from "../../apis/wallet";
import * as JWTHandler from "../../utils/JWTHandler";
import * as transform from "../../utils/StringTransformation";

describe("setUpKeys", () => {
  // eslint-disable-next-line jest/no-hooks
  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    localStorage.clear();
  });

  it("should store the DID and keys", async () => {
    expect.assertions(4);

    const addNewWalletSpy = jest
      .spyOn(SecureEnclave.Instance, "addNewWallet")
      .mockImplementationOnce(async () => Promise.resolve("did"));

    const exportEncryptedKeysSpy = jest
      .spyOn(SecureEnclave.Instance, "exportEncryptedKeys")
      .mockImplementationOnce(() => "keys");

    const storeDIDSpy = jest
      .spyOn(DataStorage, "storeDID")
      .mockImplementationOnce(() => {});
    const storeKeysSpy = jest
      .spyOn(DataStorage, "storeKeys")
      .mockImplementationOnce(() => {});

    await LoginUtils.setUpKeys("pass");

    expect(addNewWalletSpy).toHaveBeenCalledWith({
      password: "pass",
    });
    expect(exportEncryptedKeysSpy).toHaveBeenCalledWith("did");
    expect(storeDIDSpy).toHaveBeenCalledWith("did");
    expect(storeKeysSpy).toHaveBeenCalledWith("keys");
  });
});

describe("handleTicket", () => {
  it("should throw if the ticket is empty", async () => {
    expect.assertions(1);

    await expect(LoginUtils.handleTicket("", "")).rejects.toThrow(
      "no ticket found"
    );
  });

  it("should throw if the ticket is not a string", async () => {
    expect.assertions(1);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await expect(LoginUtils.handleTicket(1, "")).rejects.toThrow(
      "ticket not in string format"
    );
  });

  it("should throw if the wallet does not respond with 200 or 201", async () => {
    expect.assertions(4);

    const signTokenSpy = jest
      .spyOn(Auth, "signToken")
      .mockImplementationOnce(async () => Promise.resolve("token"));

    const establishBondSpy = jest
      .spyOn(wallet, "establishBond")
      .mockImplementationOnce(async () =>
        Promise.resolve({
          status: 400,
          data: "error",
        })
      );

    // Start test
    await expect(LoginUtils.handleTicket("ticket", "password")).rejects.toThrow(
      "error"
    );

    expect(signTokenSpy).toHaveBeenCalledTimes(1);
    expect(signTokenSpy).toHaveBeenCalledWith("ticket", "password");
    expect(establishBondSpy).toHaveBeenCalledWith("token");
  });

  it("should sign the token, establish the bond and store the connection", async () => {
    expect.assertions(6);

    const signTokenSpy = jest
      .spyOn(Auth, "signToken")
      .mockImplementationOnce(async () => Promise.resolve("token"));

    const establishBondSpy = jest
      .spyOn(wallet, "establishBond")
      .mockImplementationOnce(async () =>
        Promise.resolve({
          status: 200,
          data: {
            accessToken: "accessToken",
          },
        })
      );

    const storeJWTSpy = jest
      .spyOn(DataStorage, "storeJWT")
      .mockImplementationOnce(() => {});

    const parseJwtSpy = jest
      .spyOn(JWTHandler, "parseJwt")
      .mockImplementationOnce(() => ({
        userName: "userName",
        sub: "",
        did: "",
      }));

    const transformUserNameSpy = jest
      .spyOn(transform, "transformUserName")
      .mockImplementationOnce(() => "transformedUserName");

    const storeUserNameSpy = jest
      .spyOn(DataStorage, "storeUserName")
      .mockImplementationOnce(() => {});

    // Start test
    await LoginUtils.handleTicket("ticket", "password");

    expect(signTokenSpy).toHaveBeenCalledWith("ticket", "password");
    expect(establishBondSpy).toHaveBeenCalledWith("token");
    expect(storeJWTSpy).toHaveBeenCalledWith("accessToken");
    expect(parseJwtSpy).toHaveBeenCalledWith("accessToken");
    expect(transformUserNameSpy).toHaveBeenCalledWith("userName");
    expect(storeUserNameSpy).toHaveBeenCalledWith("transformedUserName");
  });
});
