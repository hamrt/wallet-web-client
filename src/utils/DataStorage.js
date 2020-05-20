export const storeDID = (did) => {
  localStorage.setItem("Did", did);
};
export const getDID = () => {
  return localStorage.getItem("Did");
};
export const storeUserName = (username) => {
  localStorage.setItem("UserName", username);
};
export const getUserName = () => {
  return localStorage.getItem("UserName");
};
export const storeJWT = (token) => {
  localStorage.setItem("Jwt", token);
};
export const getJWT = () => {
  return localStorage.getItem("Jwt");
};

export const connectionNotEstablished = () => {
  return (
    localStorage.getItem("Jwt") === null ||
    localStorage.getItem("Jwt") === "undefined"
  );
};

export const keysNotExist = () => {
  return (
    localStorage.getItem("Keys") === null ||
    localStorage.getItem("Keys") === "undefined"
  );
};
export const storeKeys = (keys) => {
  localStorage.setItem("Keys", keys);
};
export const getKeys = () => {
  return localStorage.getItem("Keys");
};

export const storeTerms = (accept) => {
  localStorage.setItem("T&C", accept === true);
};
export const getTerms = () => {
  if (
    localStorage.getItem("T&C") === null ||
    localStorage.getItem("T&C") === "undefined"
  ) {
    return false;
  }
  const response = localStorage.getItem("T&C");
  return response === "true";
};
