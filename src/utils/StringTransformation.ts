import * as config from "../config/config";
import * as issuer from "./issuer";

/**
 * Transform the username received from the backend to have the format:
 * firstname + lastname
 */
const transformUserName = (username: string): string => {
  const splitString = username.split("&");
  let userNameAltered = username;
  if (splitString.length > 1) {
    userNameAltered = `${splitString[1]} ${splitString[0]}`;
  }
  return userNameAltered;
};

/**
 * Auxiliar function to give different name depends if the request
 * presentation comes form Spanish university or Flemish government
 */
const requestPresentationSpecialCases = (
  type: number,
  name: string,
  typeName: string,
  redirectUrl?: string
): string => {
  let nameToDisplay = typeName;
  if (name === '["Verifiable ID","Europass Diploma"]') {
    nameToDisplay = "Request your eID and Diploma Presentation";
  }
  if (name === "Request Verifiable ID") {
    nameToDisplay = "Request your Bachelor Diploma Presentation";
  }
  if (name === "Request Verifiable ID and Europass Diploma") {
    nameToDisplay = "Request your Master Diploma Presentation";
  }
  if (redirectUrl !== undefined) {
    if (type === 3 && redirectUrl.includes("master")) {
      nameToDisplay = "Request to Sign your eID & Diploma Presentation";
    }
  }

  return nameToDisplay;
};

/**
 * Return the name of the notification type, given the number
 */
const notificationType = (
  type: number,
  name: string,
  redirectUrl?: string
): string => {
  if (type < 0) {
    return " - ";
  }
  let typeName = config.NOTIFICATION_TYPE[type];
  if (type === 2) {
    typeName = requestPresentationSpecialCases(
      type,
      name,
      typeName,
      redirectUrl
    );
  }
  if (type === 3) {
    typeName = requestPresentationSpecialCases(
      type,
      name,
      typeName,
      redirectUrl
    );
  }

  return typeName;
};

const checkIfMasterOrBachelor = async (issuerDid: string): Promise<string> => {
  const issuerName = await issuer.getIssuerName(issuerDid);
  if (issuerName.includes("Bachelor")) return "Bachelor Diploma";
  if (issuerName.includes("Master")) return "Master Diploma";
  return "Diploma";
};

/**
 * Modifies a name before disply it
 */
const modifyName = async (
  name: string,
  where: string,
  issuerDid: string
): Promise<string> => {
  let nameChanged = name;
  if (name === "Verifiable ID" && where === "notification") {
    nameChanged = "Verifiable eID";
  }
  if (name === "Verifiable ID" && where === "credential") {
    nameChanged = "My Verifiable eID";
  }
  if (name === "Verifiable Presentation" && where === "credential") {
    nameChanged = "Verifiable eID Presentation";
  }
  if (name === "VerifiablePresentation" && where === "credential") {
    nameChanged = "Verifiable eID Presentation";
  }
  if (name === '["Europass Diploma"]' && where === "credential") {
    nameChanged = await checkIfMasterOrBachelor(issuerDid);
  }
  if (name === "Europass Diploma" && where === "notification") {
    nameChanged = "Diploma";
  }
  if (name === '["Europass Diploma"]' && where === "notification") {
    nameChanged = "Diploma";
  }
  if (name === "") {
    nameChanged = " - ";
  }

  return nameChanged;
};

/**
 * Modifies the title of a notification
 */
const modifyNotificationTitle = async (
  name: string,
  type: number
): Promise<string> => {
  let title = name;
  if (type === 0) {
    title = "My Diploma";
  }
  if (type === 1) {
    title = await modifyName(name, "notification", "");
  }
  return title;
};

const setCredentialTypeName = (inputType: string): string => {
  switch (inputType) {
    case "EssifVerifiableID":
      return "Verifiable eID";
    case "EuropassCredential":
      return "Diploma";
    default:
      return inputType;
  }
};

const fixOutput = (find: string, replace: string, string: string): string => {
  const lastIndex = string.lastIndexOf(find);

  if (lastIndex === -1) {
    return string;
  }

  const beginString = string.substring(0, lastIndex);
  const endString = string.substring(lastIndex + find.length);

  return `${beginString + replace + endString}s`;
};

/**
 * Parse the array of credentials requested and display in the correct format
 */
const getSelectRequestedCredentialsText = (
  arrText: string[] | string[][]
): string => {
  const defaultText = "Select Requested Credentials";
  if (!arrText) return defaultText;
  // check if passed array is a array of arrays
  if (Array.isArray(arrText[0])) {
    const output = (arrText as string[][]).reduce(
      (tmpStr: any, typeArr: string | any[]) => {
        if (typeof typeArr[0] !== "string") return "Not valid type";
        return `${tmpStr}, ${setCredentialTypeName(
          typeArr[typeArr.length - 1]
        )} `;
      },
      "Select: "
    );
    if (output.includes("Not valid type")) return defaultText;
    const text = `${output.replace(": ,", ":")}Credential`;
    return fixOutput(",", "and", text);
  }
  // check if passed array is a string array
  if (typeof arrText[0] === "string") {
    return `Select: ${setCredentialTypeName(
      (arrText as string[])[arrText.length - 1]
    )} Credential`;
  }

  // in any other cases return default text
  return defaultText;
};

export {
  transformUserName,
  notificationType,
  modifyName,
  modifyNotificationTitle,
  getSelectRequestedCredentialsText,
};
