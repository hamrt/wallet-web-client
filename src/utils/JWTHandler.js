/**
 * Parse a JWT token
 */
function parseJwt(token) {
  try {
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
  } catch (error) {
    return "Error";
  }
}

function isTokenExpired(jwt) {
  if (jwt === null || jwt === "") return true;
  const payload = parseJwt(jwt);
  if (!payload || !payload.exp || payload === "Error") return true;
  return +payload.exp * 1000 < Date.now();
}

export { parseJwt, isTokenExpired };
