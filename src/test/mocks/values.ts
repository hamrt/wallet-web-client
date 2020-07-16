import REQUIRED_VARIABLES from "../../config/env";

export const errorEstablishBond =
  "Error connecting with the backend,(probably the ticket from EULogin has already been validated) please login again.";

export const errorGettingCredentials = "Error getting the credentials.";

export const errorGettingTheCredential = "Error getting the credential.";

export const successMessage = "The key decryption was successful.";

export const errorAcceptingNotification = "Error signing the notification.";

export const errorSigningNotification = "Error signing the notification";

export const sampleIssuer = "Sample Verifiable ID Issuer";

export const tokenUser = {
  sub: "n0035nkh",
  iat: 1581069251,
  exp: 1581155651,
  aud: "ebsi-wallet",
  did: "did:ebsi:0xF3f029e76c842bc013955bf548a9c5bAa3D3F332",
  userName: "Bean&Alex",
  userId: "n0035nkh",
};

export const loginURL = `login?service=${encodeURIComponent(
  REQUIRED_VARIABLES.REACT_APP_WALLET
)}%2Fcredentials&renew=false`;

export const bodyToSign = {
  "@id": "2b692a20-4121-11ea-91ab-59ec4b146fde",
  signature: "f0f2ca81ef13fdc7ae9ff58ae975a896627b10b8c6efe6ebf04b8188a937163c",
  selectedCredentials: [],
};

export const didAuth = {
  client_id: "https://localhost:8080/demo/spanish-university",
  "did-auth": "openid://?scope=openid://",
  request:
    "eyJhbGciOiJFUzI1NkstUiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDplYnNpOjB4YzcyODFDMDQxMkRiYUE4ZTYwNzMzMzJGRjJGNEI2YzFGRkY5ZDc0ZiNrZXktMSJ9.eyJpYXQiOjE1ODczODgwMDYsImV4cCI6MTU4NzM4ODMwNiwiaXNzIjoiZGlkOmVic2k6MHhjNzI4MUMwNDEyRGJhQThlNjA3MzMzMkZGMkY0QjZjMUZGRjlkNzRmIiwic2NvcGUiOiJvcGVuaWQgZGlkX2F1dGhuIiwicmVzcG9uc2VfdHlwZSI6ImlkX3Rva2VuIiwiY2xpZW50X2lkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6ODA4MC9kZW1vL3NwYW5pc2gtdW5pdmVyc2l0eSIsIm5vbmNlIjoiZmEyY2U1NjEtOWFiZC00Y2JiLTg3YjUtNjBkMjRmYmFiYzYxIn0.uCuvZLCPWIdthAf2oJSSuzT4goKkXaNL_fM_qTSMnb3p7wad0-QLCJ4B4E21hkDRtFYShsR8bP2s9C31kba1mAA",
  scope: "openid did_authn?response_type=id_token",
};

export const serviceUrl = "https://localhost:8080/demo/spanish-university";
export const serviceDID = "did:ebsi:0xc7281C0412DbaA8e6073332FF2F4B6c1FFF9d74f";
export const serviceName =
  "did:ebsi:0xc7281C0412DbaA8e6073332FF2F4B6c1FFF9d74f";
export const didAuthRequestJwt =
  "eyJhbGciOiJFUzI1NkstUiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDplYnNpOjB4YzcyODFDMDQxMkRiYUE4ZTYwNzMzMzJGRjJGNEI2YzFGRkY5ZDc0ZiNrZXktMSJ9.eyJpYXQiOjE1ODczODgwMDYsImV4cCI6MTU4NzM4ODMwNiwiaXNzIjoiZGlkOmVic2k6MHhjNzI4MUMwNDEyRGJhQThlNjA3MzMzMkZGMkY0QjZjMUZGRjlkNzRmIiwic2NvcGUiOiJvcGVuaWQgZGlkX2F1dGhuIiwicmVzcG9uc2VfdHlwZSI6ImlkX3Rva2VuIiwiY2xpZW50X2lkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6ODA4MC9kZW1vL3NwYW5pc2gtdW5pdmVyc2l0eSIsIm5vbmNlIjoiZmEyY2U1NjEtOWFiZC00Y2JiLTg3YjUtNjBkMjRmYmFiYzYxIn0.uCuvZLCPWIdthAf2oJSSuzT4goKkXaNL_fM_qTSMnb3p7wad0-QLCJ4B4E21hkDRtFYShsR8bP2s9C31kba1mAA";
