import moment from "moment";
import SecureEnclave from "../secureEnclave/SecureEnclave";
import * as config from "../config/config";
import { getDID } from "./DataStorage";

export const signToken = async (
  ticketFromUrl: string,
  password: string
): Promise<string> => {
  const se = SecureEnclave.Instance;
  const did = getDID();
  if (!did) throw new Error("No DID found on Local Storage.");
  const request = {
    aud: config.COMPONENT_WALLET_ID,
    exp: moment().add(15, "seconds").unix(),
    ticket: ticketFromUrl,
    publicKey: se.getPublicKey(did),
  };
  const buffer = Buffer.from(JSON.stringify(request));
  const token = await se.signJwt(did, buffer, password);
  return token;
};

export default signToken;
