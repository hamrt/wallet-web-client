export interface IWalletOptions {
  encryptedKey?: string; // can be validated with ethers' isSecretStorageWallet method
  password: string;
}
