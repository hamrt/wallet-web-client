import SecureEnclave from "../../secureEnclave/SecureEnclave";
import {
  storeDID,
  storeKeys,
  storeJWT,
  storeUserName,
} from "../../utils/DataStorage";
import { signToken } from "../../utils/auth";
import * as transform from "../../utils/StringTransformation";
import * as wallet from "../../apis/wallet";
import { parseJwt } from "../../utils/JWTHandler";

export const setUpKeys = async (userPassword: string) => {
  const se = SecureEnclave.Instance;
  const options = {
    password: userPassword,
  };
  const did = await se.addNewWallet(options);
  const keys = se.exportEncryptedKeys(did);
  storeDID(did);
  storeKeys(keys);
};

export const storeConnection = (jwt: string) => {
  storeJWT(jwt);
  const token = parseJwt(jwt);
  const username = transform.transformUserName(token.userName);
  storeUserName(username);
};

export const handleTicket = async (ticket: string, password: string) => {
  if (!ticket) {
    throw new Error("no ticket found");
  }
  if (typeof ticket !== "string") {
    throw new Error("ticket not in string format");
  }

  const token = await signToken(ticket, password);
  const response = await wallet.establishBond(token);

  if (response.status === 200 || response.status === 201) {
    storeConnection(response.data.accessToken);
  } else {
    throw new Error(response.data);
  }
};
