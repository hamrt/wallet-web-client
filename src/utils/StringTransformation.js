import * as config from "../config/config";

/**
 * Transform the username received from the backend to have the format:
 * firstname + lastname
 */
function transformUserName(username) {
  const splitString = username.split("&");
  let userNameAltered = username;
  if (splitString.length > 1) {
    userNameAltered = `${splitString[1]} ${splitString[0]}`;
  }
  return userNameAltered;
}

/**
 * Auxiliar function to give different name depends if the request presentation comes form Spanish university or Flemish government
 */
function requestPresentationSpecialCases(type, name, typeName, redirectUrl) {
  let nameToDisplay = typeName;
  if (name === '["Verifiable ID","Europass Diploma"]') {
    nameToDisplay = "Request your eID and Diploma Presentation";
  }
  if (redirectUrl !== undefined) {
    if (type === 3 && redirectUrl.includes("master")) {
      nameToDisplay = "Request to Sign your eID & Diploma Presentation";
    }
  }

  return nameToDisplay;
}

/**
 * Return the name of the notification type, given the number
 */
function notificationType(type, name, redirectUrl) {
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
}
function checkIfMasterOrBachelor(issuer) {
  let nameChanged = "Diploma";
  if (
    config.DID_EBSI_SERVICES[issuer] ===
    "Sample University - Bachelor's Programme"
  ) {
    nameChanged = "Bachelor Diploma";
  }
  if (
    config.DID_EBSI_SERVICES[issuer] ===
    "Sample University - Master's Programme"
  ) {
    nameChanged = "Master Diploma";
  }
  return nameChanged;
}
/**
 * Modifies a name before disply it
 */
function modifyName(name, where, issuer) {
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
    nameChanged = checkIfMasterOrBachelor(issuer);
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
}

/**
 * Modifies the title of a notification
 */
function modifyNotificationTitle(name, type) {
  let title = name;
  if (type === 0) {
    title = "My Diploma";
  }
  if (type === 1) {
    title = modifyName(name, "notification", "");
  }
  return title;
}
/**
 * Parse the array of credentials requested and display in the correct format
 */
function requestedCredentials(name) {
  let requestedText = "Select Requested Credentials";
  if (name === '["Verifiable ID","Europass Diploma"]') {
    requestedText = "Select: Verifiable eID, Diploma";
  }
  if (name === '["Verifiable ID"]') {
    requestedText = "Select: Verifiable eID";
  }

  return requestedText;
}

export {
  transformUserName,
  notificationType,
  modifyName,
  modifyNotificationTitle,
  requestedCredentials,
};
