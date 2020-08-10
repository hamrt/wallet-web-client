import EC from "elliptic";
import { generateKeys, getDid, prefixWith0x } from "./Util";
import * as mocks from "../test/mocks/mocks";

describe("util test suite", () => {
  it("should generate a new key pair", () => {
    expect.assertions(2);
    const mockGetPublicKey = jest
      .fn()
      .mockReturnValue(mocks.newKeys.publicKey as any);
    const mockGetPrivateKey = jest
      .fn()
      .mockReturnValue(mocks.newKeys.privateKey as any);
    const mockGenKeyPair = jest
      .spyOn(EC.ec.prototype, "genKeyPair")
      .mockImplementation(() => {
        return {
          ec: mocks.keyPairEC,
          getPublic: mockGetPublicKey,
          getPrivate: mockGetPrivateKey,
        } as any;
      });
    const keys = generateKeys();
    expect(keys).toBeDefined();
    expect(mockGenKeyPair).toHaveBeenCalledTimes(1);
  });

  it("should return a did:ebsi from a ethaddress", () => {
    expect.assertions(1);
    const did = getDid(mocks.wallet.ethAddress);
    expect(did).toBe(`did:ebsi:${mocks.wallet.ethAddress}`);
  });

  it("should prefix the keys with 0x if they don't start with 0x", () => {
    expect.assertions(1);
    expect(prefixWith0x("fakekey")).toStrictEqual("0xfakekey");
  });

  it("should not prefix the keys with 0x if they already start with 0x", () => {
    expect.assertions(1);
    expect(prefixWith0x("0xfakekey")).toStrictEqual("0xfakekey");
  });
});
