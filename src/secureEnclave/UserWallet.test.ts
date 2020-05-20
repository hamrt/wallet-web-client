import { decodeJWT } from "did-jwt";
import { TransactionRequest } from "ethers/providers";
import { ethers } from "ethers";
import { Transaction } from "ethers/utils";
import UserWallet from "./UserWallet";
import { IWalletOptions } from "./IWallet";
import * as mocks from "../test/mocks/mocks";
import * as util from "./Util";

describe("userWallet constructor", () => {
  it("should create keys when setting a password", async () => {
    expect.assertions(3);
    const mockGenerateKeys = jest
      .spyOn(util, "generateKeys")
      .mockReturnValue(mocks.newKeys);
    const password = "1234";
    const wallet = await UserWallet.userWalletBuilder({ password });
    expect(wallet).toBeDefined();
    const did = wallet.getDid();
    expect(did).toContain("did:ebsi:0x");
    expect(mockGenerateKeys).toHaveBeenCalledTimes(1);
  });

  it("should load a wallet when setting key store and a password", async () => {
    expect.assertions(2);
    const options: IWalletOptions = {
      encryptedKey: JSON.stringify(mocks.keys),
      password: "1234",
    };
    const wallet = await UserWallet.userWalletBuilder(options);
    expect(wallet).toBeDefined();
    const did = wallet.getDid();
    expect(did).toContain("did:ebsi:0x");
  });

  it("should throw an Error when creating a wallet without password", async () => {
    expect.assertions(1);
    await expect(UserWallet.userWalletBuilder({} as any)).rejects.toThrow(
      "Password needs to be provided"
    );
  });
});

describe("return user Wallet attributes", () => {
  it("should return exportEncryptedKeys", async () => {
    expect.assertions(2);
    const options: IWalletOptions = {
      encryptedKey: JSON.stringify(mocks.keys),
      password: "1234",
    };
    const wallet = await UserWallet.userWalletBuilder(options);
    expect(wallet).toBeDefined();
    const exportEncryptedKeys = wallet.exportEncryptedKeys();
    expect(exportEncryptedKeys).toMatch(JSON.stringify(mocks.keys));
  });

  it("should return publicKey", async () => {
    expect.assertions(2);
    const options: IWalletOptions = {
      encryptedKey: JSON.stringify(mocks.keys),
      password: "1234",
    };
    const wallet = await UserWallet.userWalletBuilder(options);
    expect(wallet).toBeDefined();
    const { publicKey } = wallet;
    expect(publicKey).toMatch(mocks.publicKeyFromKeys);
  });

  it("should return privateKey", async () => {
    expect.assertions(2);
    const options: IWalletOptions = {
      encryptedKey: JSON.stringify(mocks.keys),
      password: "1234",
    };
    const wallet = await UserWallet.userWalletBuilder(options);
    expect(wallet).toBeDefined();
    const { privateKey } = wallet;
    expect(privateKey).toMatch(mocks.privateKeyFromKeys);
  });
});

describe("when signing a JWT using did-jwt", () => {
  const vc = Buffer.from(
    JSON.stringify({ name: "Nina Simone", country: "US" })
  );

  jest.setTimeout(10000);
  it("should create a valid jwt", async () => {
    expect.assertions(1);
    const password = "1234";
    const wallet = await UserWallet.userWalletBuilder({ password });

    const jwt = await wallet.signJwt(vc, password);
    const { payload } = decodeJWT(jwt);

    expect(payload).toBeDefined();
  });

  jest.setTimeout(20000);

  it("should throw an error if password is not sent", async () => {
    expect.assertions(1);
    const password = "";
    const wallet = await UserWallet.userWalletBuilder({
      password: "somepassword",
    });

    await expect(wallet.signJwt(vc, password)).rejects.toThrow(
      "Password must be provided to sign."
    );
  });
});

describe("when signing an Ethereum Tx", () => {
  it("should create a valid tx signature", async () => {
    expect.assertions(1);
    const password = "1234";
    const data = `0x${Buffer.from("Sending test messages!").toString("hex")}`;
    const wallet = await UserWallet.userWalletBuilder({ password });
    const txJSON: TransactionRequest = {
      gasPrice: ethers.utils.hexlify(0),
      gasLimit: ethers.utils.hexlify(221000),
      to: "0x0000000000000000000000000000000000000000",
      value: ethers.utils.parseEther("0"),
      nonce: "0x0",
      data,
    };

    const signedTx = await wallet.signTx(txJSON, password);
    const parsed: Transaction = ethers.utils.parseTransaction(signedTx);
    expect(parsed.from).toBe(wallet.ethAddress);
  });
});
