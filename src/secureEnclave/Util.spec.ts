import EC from "elliptic";
import { generateKeys, getDid } from "./Util";
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
});
