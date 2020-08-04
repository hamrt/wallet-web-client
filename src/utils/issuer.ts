import axios from "axios";
import REQUIRED_VARIABLES from "../config/env";
import * as userStorage from "./DataStorage";
import { strB64dec } from "./strB64dec";

export interface IssuerInfoDiploma {
  issuerDID: string;
  preferredName: string;
  alternativeName: string;
  [x: string]: any;
}

export interface IssuerInfoGov {
  issuerDID: string;
  name: string;
  [x: string]: any;
}

export type IssuerInfo = IssuerInfoDiploma | IssuerInfoGov;

/**
 * Returns the issuer name either if it is the user or a registered
 * Trusted Issuer. If no issuer is found, it does not fails but returns
 * the DID received.
 * @param issuerDid DID from the issuer
 */
const getIssuerName = async (issuerDid: string): Promise<string> => {
  // return user stored name when user is the issuer
  if (issuerDid === userStorage.getDID())
    return userStorage.getUserName() || issuerDid;

  // or get issuerName from Trusted Issuers Registry API
  try {
    const url = `${REQUIRED_VARIABLES.TRUSTED_ISSUERS_REGISTRY_URL}/${issuerDid}`;
    const response = await axios.get(url);
    if (
      !response ||
      response.status !== 200 ||
      !response.data ||
      !response.data.entities ||
      !response.data.entities[0]
    )
      return issuerDid;

    // Extract info from first entity
    const [issuerInfo]: [IssuerInfo] = response.data.entities;

    if (!issuerInfo.name && !issuerInfo.preferredName) return issuerDid;
    return issuerInfo.name || issuerInfo.preferredName;
  } catch (error) {
    return issuerDid;
  }
};

const getIssuer = async (credential: any): Promise<string> => {
  try {
    let issuer;
    if (credential.name === "VerifiablePresentation") {
      issuer = await getIssuerName(credential.did);
    } else {
      const dataInBase64 = credential.data.base64;
      const data = strB64dec(dataInBase64);
      const dataInJSON = JSON.parse(data);
      issuer = await getIssuerName(dataInJSON.issuer);
    }
    return issuer;
  } catch (error) {
    return "-";
  }
};

export { getIssuerName, getIssuer };
