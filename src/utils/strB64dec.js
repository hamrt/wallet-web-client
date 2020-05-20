import { decode as atob } from "base-64";
/**
 * Decodes a Base64 string in an UTF-8 string format
 * @param input Base64 encoded string to decode
 */
export default function strB64dec(input) {
  const dec = atob(input);
  return dec;
}
