import { TransactionRequest } from "ethers/providers";
import UserWallet, { IWalletOptions } from "./UserWallet";

/**
 * Class to a Secure Enclave
 */
export default class SecureEnclave {
  private wallets: Map<string, UserWallet>;

  private static instance: SecureEnclave;

  private constructor() {
    this.wallets = new Map<string, UserWallet>();
  }

  /**
   * Returns an instance of the created SecureEnclave
   * Used when it is not known the constructor parameters, which
   * should be known only in the controller class
   */
  public static get Instance(): SecureEnclave {
    const instance = this.instance || (this.instance = new this());
    return instance;
  }

  public getWallet(did: string): UserWallet | undefined {
    return this.wallets.get(did);
  }

  /**
   * Adds a new wallet to the Enclave
   * @param options
   */
  public async addNewWallet(options: IWalletOptions): Promise<string> {
    try {
      const wallet = await UserWallet.userWalletBuilder(options);
      this.wallets.set(wallet.getDid(), wallet);
      const did = wallet.getDid();
      return did;
    } catch (error) {
      throw new Error(`Wallet could not be created. ${error.message}`);
    }
  }

  /**
   * Restores a wallet from a JSON encrypted file
   */
  public async restoreWallet(options: IWalletOptions): Promise<string> {
    if (!options.encryptedKey)
      throw new Error("JSON encrypted key must be provided");
    const did = await this.addNewWallet(options);
    return did;
  }

  public getPublicKey(did: string): string {
    const wallet = this.wallets.get(did);
    if (!wallet) throw new Error("Wallet not found");

    return wallet.publicKey;
  }

  public getPrivateKey(did: string): string {
    const wallet = this.wallets.get(did);
    if (!wallet) throw new Error("Wallet not found");

    return wallet.privateKey;
  }

  public exportEncryptedKeys(did: string): string {
    const wallet = this.wallets.get(did);
    if (!wallet) throw new Error("Wallet not found");

    return wallet.exportEncryptedKeys();
  }

  /**
   * Signs a JWT using did-jwt methods.
   * @param did, the did of the signer
   * @param data, payload to be included on the JWT
   * @param password, password of the wallet (for User wallets only).
   */
  public async signJwt(
    did: string,
    data: Buffer,
    password: string
  ): Promise<any> {
    const wallet = this.wallets.get(did);
    if (!wallet) throw new Error("Wallet not found");

    const jwtSigned = await wallet.signJwt(data, password);
    return jwtSigned;
  }

  public async signTx(
    did: string,
    txJSON: TransactionRequest,
    password: string = ""
  ): Promise<string> {
    const wallet = this.wallets.get(did);
    if (!wallet) throw new Error("Wallet not found");

    const txSigned = await wallet.signTx(txJSON, password);
    return txSigned;
  }
}
