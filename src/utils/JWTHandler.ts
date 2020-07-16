import { JWTClaims } from "@cef-ebsi/did-auth/dist";

export interface IUserAuthZToken extends JWTClaims {
  sub: string; // EU Login/ECAS Username that is obtained from the ECAS.
  iat?: number; // The date at a time when the Access Token was issued.
  exp?: number; // The date and time on or after which the token MUST NOT be accepted for processing. (expiry is 900s)
  aud?: string; // Name of the application,  as registered in the Trusted Apps Registry, to which the Access Token is intended for.
  did: string; // DID of the user as specified in the Access Token Request.
  userName: string; // EU Login/ECAS Name and Surname of the user.
}

/**
 * Parse a JWT token
 */
const parseJwt = (token: string): IUserAuthZToken => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function atobFunction(c) {
        return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
};

const isTokenExpired = (jwt: string): boolean => {
  if (jwt === null || jwt === "") return true;
  const payload = parseJwt(jwt);
  if (!payload || !payload.exp) return true;
  return +payload.exp * 1000 < Date.now();
};

export { parseJwt, isTokenExpired };
