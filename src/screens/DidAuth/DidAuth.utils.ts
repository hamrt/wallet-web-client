import { EbsiDidAuth, DidAuthResponseCall } from "@cef-ebsi/did-auth";
import SecureEnclave from "../../secureEnclave/SecureEnclave";
import { getDID, getKeys } from "../../utils/DataStorage";
import { IWalletOptions } from "../../secureEnclave/UserWallet";

export const createResponse = async (nonce: string, serviceUrl: string) => {
  const did = getDID();
  if (!did) throw new Error("No DID found on Local Storage.");

  const privateKey = SecureEnclave.Instance.getPrivateKey(did);

  const didAuthResponseCall: DidAuthResponseCall = {
    hexPrivatekey: privateKey, // private key managed by the user. Should be passed in hexadecimal format
    did, // User DID
    nonce, // same nonce received as a Request Payload after verifying it
    redirectUri: serviceUrl, // parsed URI from the DID Auth Request payload
  };

  const didAuthResponseJwt = await EbsiDidAuth.createDidAuthResponse(
    didAuthResponseCall
  );

  window.location.replace(`${serviceUrl}?response=${didAuthResponseJwt}`);
};

export const decryptKeys = async (password: string) => {
  const encryptedKey = getKeys();
  if (!encryptedKey) throw new Error("No keys found.");

  const options: IWalletOptions = {
    encryptedKey,
    password,
  };

  await SecureEnclave.Instance.restoreWallet(options);
};
