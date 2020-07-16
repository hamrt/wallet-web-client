export const storeDID = (did: string): void => {
  localStorage.setItem("Did", did);
};
export const getDID = (): string | null => {
  return localStorage.getItem("Did");
};
export const storeUserName = (username: string): void => {
  localStorage.setItem("UserName", username);
};
export const getUserName = (): string | null => {
  return localStorage.getItem("UserName");
};
export const storeJWT = (token: string): void => {
  localStorage.setItem("Jwt", token);
};
export const getJWT = (): string | null => {
  return localStorage.getItem("Jwt");
};

export const connectionNotEstablished = (): boolean => {
  return (
    localStorage.getItem("Jwt") === null ||
    localStorage.getItem("Jwt") === "undefined"
  );
};

export const keysNotExist = (): boolean => {
  return (
    localStorage.getItem("Keys") === null ||
    localStorage.getItem("Keys") === "undefined"
  );
};
export const storeKeys = (keys: string): void => {
  localStorage.setItem("Keys", keys);
};
export const getKeys = (): string | null => {
  const keys = localStorage.getItem("Keys");
  if (!keys) return null;
  return keys;
};

export const storeTerms = (accept: boolean): void => {
  localStorage.setItem("T&C", accept ? "true" : "false");
};
export const getTerms = (): boolean => {
  if (
    localStorage.getItem("T&C") === null ||
    localStorage.getItem("T&C") === "undefined"
  ) {
    return false;
  }
  const response = localStorage.getItem("T&C");
  return response === "true";
};
