import * as DataStorage from "./DataStorage";
import * as mocks from "../test/mocks/mocks";

describe("data storage", () => {
  it("should store the DID in the local storage", () => {
    expect.assertions(1);
    DataStorage.storeDID(mocks.did);

    expect(DataStorage.getDID()).toBe(mocks.did);
  });
  it("should store the user name in the local storage", () => {
    expect.assertions(1);
    DataStorage.storeUserName("Eva");

    expect(DataStorage.getUserName()).toBe("Eva");
  });
  it("should store the JWT in the local storage", () => {
    expect.assertions(1);
    DataStorage.storeJWT(mocks.jwtToEstablishBond);

    expect(DataStorage.getJWT()).toBe(mocks.jwtToEstablishBond);
  });
  it("should store the keys in the local storage", () => {
    expect.assertions(1);
    DataStorage.storeKeys(JSON.stringify(mocks.keys));

    expect(DataStorage.getKeys()).toBe(JSON.stringify(mocks.keys));
  });
  it("should store the terms in the local storage", () => {
    expect.assertions(1);
    DataStorage.storeTerms(true);

    expect(DataStorage.getTerms()).toBe(true);
  });
});
