import { decode as atob } from "base-64";

/**
 * Decodes a Base64 string in an UTF-8 string format
 * @param input Base64 encoded string to decode
 */
export const strB64dec = (input: string): string => {
  const dec = atob(input);
  return dec;
};

export const parseDecodedData = (input: string): JSON => {
  try {
    const decoded = strB64dec(input);
    const dataParsed = JSON.parse(decoded);
    if (!dataParsed) return JSON.parse(JSON.stringify({}));
    return dataParsed;
  } catch (e) {
    return JSON.parse(JSON.stringify({}));
  }
};
