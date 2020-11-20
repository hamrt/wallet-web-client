import base64url from "base64url";

/**
 * Decodes a Base64 string in an UTF-8 string format
 * @param input Base64 encoded string to decode
 */
export const strB64dec = (input: string): string => {
  return base64url.decode(input);
};

export const parseDecodedData = (input: string): { [x: string]: unknown } => {
  try {
    const decoded = strB64dec(input);
    const dataParsed = JSON.parse(decoded);

    if (!dataParsed) return {};

    return dataParsed;
  } catch (e) {
    return {};
  }
};
