import { ethers } from "ethers";
import { SimpleSigner, createJwt } from "@cef-ebsi/did-jwt";
import { TransactionRequest } from "ethers/providers";
import * as util from "./Util";

export interface IWalletOptions {
  encryptedKey?: string; // can be validated with ethers' isSecretStorageWallet method
  password: string;
}

/**
 * UserWallet handles and stores secp256k1 keys.
 * It keeps them in _encryptedKey JSON encrypted format and instantiates a ethers wallet to access its private key for
 * signing.
 */
export default class UserWallet {
  private encryptedKey!: string;

  public ethAddress!: string;

  private publicKeyHex!: string;

  private privateKeyHex!: string;

  private constructor(encryptedKey?: string) {
    if (encryptedKey) this.encryptedKey = encryptedKey;
  }

  public static async userWalletBuilder(
    options: IWalletOptions
  ): Promise<UserWallet> {
    if (!options.password) {
      throw new Error("Password needs to be provided");
    }
    const wallet = new UserWallet(options.encryptedKey);
    // create new wallet when no encrypted key is provided
    if (!options.encryptedKey) {
      await wallet.initWithPass(options.password);
      return wallet;
    }
    // load wallet from encrypted key
    await wallet.loadWallet(options.encryptedKey, options.password);
    return wallet;
  }

  private async initWithPass(password: string): Promise<void> {
    const kp = util.generateKeys();
    const wallet: ethers.Wallet = new ethers.Wallet(kp.privateKey);
    this.ethAddress = wallet.address;
    this.publicKeyHex = new ethers.utils.SigningKey(
      wallet.privateKey
    ).publicKey;
    this.privateKeyHex = new ethers.utils.SigningKey(
      wallet.privateKey
    ).privateKey;
    this.encryptedKey = await wallet.encrypt(password);
  }

  /**
   * Loads wallet from a V3 Web3 Secret Storage JSON object
   * @param v3JsonWallet
   * @param password
   */
  private async loadWallet(
    v3JsonWallet: string,
    password: string
  ): Promise<ethers.Wallet> {
    const wallet: ethers.Wallet = await ethers.Wallet.fromEncryptedJson(
      v3JsonWallet,
      password
    );
    this.ethAddress = wallet.address;
    this.publicKeyHex = new ethers.utils.SigningKey(
      wallet.privateKey
    ).publicKey;
    this.privateKeyHex = new ethers.utils.SigningKey(
      wallet.privateKey
    ).privateKey;
    return wallet;
  }

  public exportEncryptedKeys(): string {
    return this.encryptedKey;
  }

  public get publicKey(): string {
    return this.publicKeyHex;
  }

  public get privateKey(): string {
    return this.privateKeyHex;
  }

  public async signJwt(data: Buffer, password: string): Promise<string> {
    if (password.length === 0)
      throw new Error("Password must be provided to sign.");
    const credentialDataObject = JSON.parse(data.toString());
    const wallet = await this.loadWallet(this.encryptedKey, password);
    const signer = SimpleSigner(wallet.privateKey.replace("0x", "")); // Removing 0x from wallet private key as input of SimpleSigner
    const jwt = await createJwt(credentialDataObject, {
      issuer: `${this.getDid()}`,
      alg: "ES256K-R",
      signer,
    });
    return jwt;
  }

  /**
   * Signs an Ethereum Transaction.
   * @param txJSON
   * @param password
   */
  public async signTx(
    txJSON: TransactionRequest,
    password: string
  ): Promise<string> {
    const wallet = await this.loadWallet(this.encryptedKey, password);
    const walletSigned = await wallet.sign(txJSON);
    return walletSigned;
  }

  public getDid(): string {
    return util.getDid(this.ethAddress);
  }
}
