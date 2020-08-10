import { TransactionRequest } from "@ethersproject/abstract-provider";
import { ethers } from "ethers";
import SecureEnclave from "./SecureEnclave";
import UserWallet, { IWalletOptions } from "./UserWallet";
import * as mocks from "../test/mocks/mocks";

describe("secure enclave", () => {
  it("should return a Secure Enclave Instance", () => {
    expect.assertions(1);
    const se = SecureEnclave.Instance;
    expect(se).toBeInstanceOf(SecureEnclave);
  });

  it("should return the same Secure Enclave Instance", () => {
    expect.assertions(3);
    const se = SecureEnclave.Instance;
    expect(se).toBeInstanceOf(SecureEnclave);
    const se2 = SecureEnclave.Instance;
    expect(se2).toBeInstanceOf(SecureEnclave);
    expect(se).toMatchObject(se2);
  });

  it("should add a new wallet from a given password", async () => {
    expect.assertions(2);
    const se = SecureEnclave.Instance;
    const mockedWalletBuilder = jest
      .spyOn(UserWallet, "userWalletBuilder")
      .mockResolvedValue(mocks.UserWallet as any);

    const options: IWalletOptions = {
      password: "1234",
    };
    const did = await se.addNewWallet(options);
    expect(did).toBe(mocks.mockedGetDID.did);
    expect(mockedWalletBuilder).toHaveBeenCalledTimes(1);
    jest.clearAllMocks();
  });

  it("should return a UserWallet", async () => {
    expect.assertions(3);
    const se = SecureEnclave.Instance;
    const mockedWalletBuilder = jest
      .spyOn(UserWallet, "userWalletBuilder")
      .mockResolvedValue(mocks.UserWallet as any);

    const options: IWalletOptions = {
      password: "1234",
    };
    const did = await se.addNewWallet(options);
    expect(did).toBe(mocks.mockedGetDID.did);
    expect(mockedWalletBuilder).toHaveBeenCalledTimes(1);

    const userWallet = se.getWallet(did);
    expect(userWallet).toBeDefined();
    jest.clearAllMocks();
  });

  it("should return undefined with a non existent did", async () => {
    expect.assertions(1);
    const se = SecureEnclave.Instance;
    const userWallet = se.getWallet("did:ebsi:0x00a");
    expect(userWallet).not.toBeDefined();
  });

  it("should restore a wallet given a password and a encrypted json", async () => {
    expect.assertions(2);
    const se = SecureEnclave.Instance;
    const mockedWalletBuilder = jest
      .spyOn(UserWallet, "userWalletBuilder")
      .mockResolvedValue(mocks.UserWallet as any);

    const options: IWalletOptions = {
      encryptedKey: JSON.stringify(mocks.keys),
      password: "1234",
    };
    const did = await se.restoreWallet(options);
    expect(did).toBe(mocks.mockedGetDID.did);
    expect(mockedWalletBuilder).toHaveBeenCalledTimes(1);
    jest.clearAllMocks();
  });

  it("should throw an error trying to create a wallet without a password", async () => {
    expect.assertions(2);
    const se = SecureEnclave.Instance;
    const mockedWalletBuilder = jest
      .spyOn(UserWallet, "userWalletBuilder")
      .mockRejectedValue(new Error(`Wallet could not be created: `));

    await expect(se.addNewWallet({} as any)).rejects.toThrow(
      `Wallet could not be created: `
    );
    expect(mockedWalletBuilder).toHaveBeenCalledTimes(1);
    jest.clearAllMocks();
  });

  it("should throw an error trying to restore a wallet given a password and without an encrypted json", async () => {
    expect.assertions(1);
    const se = SecureEnclave.Instance;

    const options: IWalletOptions = {
      password: "1234",
    };
    await expect(se.restoreWallet(options)).rejects.toThrow(
      "JSON encrypted key must be provided"
    );
  });

  it("should throw an error trying to signJwt with a did not registered", async () => {
    expect.assertions(1);
    const se = SecureEnclave.Instance;
    const vc = Buffer.from(
      JSON.stringify({ name: "Nina Simone", country: "US" })
    );

    const password = "";
    const did = "did:fake:0x00";
    const jwt = se.signJwt(did, vc, password);
    await expect(jwt).rejects.toThrow("Wallet not found");
  });

  it("should throw an error trying to signTx with a did not registered", async () => {
    expect.assertions(1);
    const se = SecureEnclave.Instance;
    const txJSON = {};

    const password = "";
    const did = "did:fake:0x00";
    const jwt = se.signTx(did, txJSON as any, password);
    await expect(jwt).rejects.toThrow("Wallet not found");
  });

  it("should return a publicKey", async () => {
    expect.assertions(3);
    const se = SecureEnclave.Instance;
    const mockedWalletBuilder = jest
      .spyOn(UserWallet, "userWalletBuilder")
      .mockResolvedValue(mocks.UserWallet as any);

    const options: IWalletOptions = {
      password: "1234",
    };
    const did = await se.addNewWallet(options);
    expect(did).toBe(mocks.mockedGetDID.did);
    expect(mockedWalletBuilder).toHaveBeenCalledTimes(1);
    const publicKey = se.getPublicKey(did);
    expect(publicKey).toBe(mocks.UserWallet.publicKey);
    jest.clearAllMocks();
  });

  it("should throw an error trying to return a publicKey", async () => {
    expect.assertions(1);
    const se = SecureEnclave.Instance;
    expect(() => se.getPublicKey("did:fake:0x00")).toThrow("Wallet not found");
  });

  it("should return a privateKey", async () => {
    expect.assertions(3);
    const se = SecureEnclave.Instance;
    const mockedWalletBuilder = jest
      .spyOn(UserWallet, "userWalletBuilder")
      .mockResolvedValue(mocks.UserWallet as any);

    const options: IWalletOptions = {
      password: "1234",
    };
    const did = await se.addNewWallet(options);
    expect(did).toBe(mocks.mockedGetDID.did);
    expect(mockedWalletBuilder).toHaveBeenCalledTimes(1);
    const privateKey = se.getPrivateKey(did);
    expect(privateKey).toBe(mocks.UserWallet.privateKey);
    jest.clearAllMocks();
  });

  it("should throw an error trying to return a privateKey", async () => {
    expect.assertions(1);
    const se = SecureEnclave.Instance;
    expect(() => se.getPrivateKey("did:fake:0x00")).toThrow("Wallet not found");
  });

  it("should return an encrypted key", async () => {
    expect.assertions(3);
    const se = SecureEnclave.Instance;
    const mockedWalletBuilder = jest
      .spyOn(UserWallet, "userWalletBuilder")
      .mockResolvedValue(mocks.UserWallet as any);

    const options: IWalletOptions = {
      password: "1234",
    };
    const did = await se.addNewWallet(options);
    expect(did).toBe(mocks.mockedGetDID.did);
    expect(mockedWalletBuilder).toHaveBeenCalledTimes(1);
    const encryptedKey = se.exportEncryptedKeys(did);
    expect(encryptedKey).toBe(mocks.UserWallet.encryptedKey);
    jest.clearAllMocks();
  });

  it("should throw an error trying to export encrypted keys", async () => {
    expect.assertions(1);
    const se = SecureEnclave.Instance;
    expect(() => se.exportEncryptedKeys("did:fake:0x00")).toThrow(
      "Wallet not found"
    );
  });

  describe("signing functions", () => {
    it("should throw an error trying to sign a payload with a did not registered", async () => {
      expect.assertions(1);
      const se = SecureEnclave.Instance;
      const payload = Buffer.from("");
      await expect(se.signJwt("did:fake:0x00", payload, "")).rejects.toThrow(
        "Wallet not found"
      );
    });

    it("should signJwt a payload", async () => {
      expect.assertions(3);
      const se = SecureEnclave.Instance;
      const mockedWalletBuilder = jest
        .spyOn(UserWallet, "userWalletBuilder")
        .mockResolvedValue(mocks.UserWallet as any);
      const options: IWalletOptions = {
        password: "1234",
      };
      const did = await se.addNewWallet(options);
      expect(did).toBe(mocks.mockedGetDID.did);
      expect(mockedWalletBuilder).toHaveBeenCalledTimes(1);
      const payload = Buffer.from(
        JSON.stringify({ name: "Nina Simone", country: "US" })
      );
      const signature = await se.signJwt(did, payload, options.password);
      expect(signature).toBe(mocks.mockedSignature);
      jest.clearAllMocks();
    });
    it("should throw an error trying to signtx a payload with a did not registered", async () => {
      expect.assertions(1);
      const se = SecureEnclave.Instance;
      await expect(se.signTx("did:fake:0x00", {} as any)).rejects.toThrow(
        "Wallet not found"
      );
    });

    it("should signTx", async () => {
      expect.assertions(3);
      const se = SecureEnclave.Instance;
      const mockedWalletBuilder = jest
        .spyOn(UserWallet, "userWalletBuilder")
        .mockResolvedValue(mocks.UserWallet as any);
      const options: IWalletOptions = {
        password: "1234",
      };
      const did = await se.addNewWallet(options);
      expect(did).toBe(mocks.mockedGetDID.did);
      expect(mockedWalletBuilder).toHaveBeenCalledTimes(1);
      const data = `0x${Buffer.from("Sending test messages!").toString("hex")}`;
      const txJSON: TransactionRequest = {
        gasPrice: ethers.utils.hexlify(0),
        gasLimit: ethers.utils.hexlify(221000),
        to: "0x0000000000000000000000000000000000000000",
        value: ethers.utils.parseEther("0"),
        nonce: "0x0",
        data,
      };
      const signature = await se.signTx(did, txJSON, options.password);
      expect(signature).toBe(mocks.mockedSignature);
      jest.clearAllMocks();
    });
  });
});
