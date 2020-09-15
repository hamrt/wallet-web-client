import { ec as EllipticCurve } from "elliptic";

/**
 * Generate keys
 * @returns Object with address and privateKey in HEX format
 */
const generateKeys = (): { publicKey: string; privateKey: string } => {
  const kp = new EllipticCurve("secp256k1").genKeyPair();
  const publicKey = kp.getPublic("hex");
  const privateKey = kp.getPrivate("hex");
  return { publicKey, privateKey };
};

function getDid(ethAddress: string): string {
  return `did:ebsi:${ethAddress}`;
}

function prefixWith0x(key: string): string {
  return key.startsWith("0x") ? key : `0x${key}`;
}

export { generateKeys, getDid, prefixWith0x };
