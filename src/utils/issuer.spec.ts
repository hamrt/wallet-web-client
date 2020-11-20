import axios from "axios";
import base64url from "base64url";
import REQUIRED_VARIABLES from "../config/env";
import * as issuer from "./issuer";
import * as userStorage from "./DataStorage";

describe("issuer tests", () => {
  it("should return a username", async () => {
    expect.assertions(1);
    const expectedIssuerName = "test userName";
    const did = "did:ebsi:0x16048B83FAdaCdCB20198ABc45562Df1A3e289aF";
    jest.spyOn(userStorage, "getDID").mockReturnValue(did);
    jest.spyOn(userStorage, "getUserName").mockReturnValue(expectedIssuerName);
    const issuerName = await issuer.getIssuerName(did);
    expect(issuerName).toMatch(expectedIssuerName);
    jest.restoreAllMocks();
  });

  it("should return issuerDID when no username is set", async () => {
    expect.assertions(1);
    const did = "did:ebsi:0x16048B83FAdaCdCB20198ABc45562Df1A3e289aF";
    jest.spyOn(userStorage, "getDID").mockReturnValue(did);
    jest.spyOn(userStorage, "getUserName").mockReturnValue(null);
    const issuerName = await issuer.getIssuerName(did);
    expect(issuerName).toMatch(did);
    jest.restoreAllMocks();
  });

  it("should return issuerDID when got an error from trustedIssuerRegistry", async () => {
    expect.assertions(1);
    const did = "did:ebsi:0x16048B83FAdaCdCB20198ABc45562Df1A3e289aF";
    jest.spyOn(userStorage, "getDID").mockReturnValue(null);
    jest.spyOn(axios, "get").mockRejectedValue(new Error("some error"));
    const issuerName = await issuer.getIssuerName(did);
    expect(issuerName).toMatch(did);
    jest.restoreAllMocks();
  });

  it("should return issuerDID when no response from trustedIssuerRegistry", async () => {
    expect.assertions(1);
    const did = "did:ebsi:0x16048B83FAdaCdCB20198ABc45562Df1A3e289aF";
    jest.spyOn(userStorage, "getDID").mockReturnValue(null);
    jest.spyOn(axios, "get").mockResolvedValue(undefined as any);
    const issuerName = await issuer.getIssuerName(did);
    expect(issuerName).toMatch(did);
    jest.restoreAllMocks();
  });

  it("should return issuerDID when response status no 200 from trustedIssuerRegistry", async () => {
    expect.assertions(1);
    const did = "did:ebsi:0x16048B83FAdaCdCB20198ABc45562Df1A3e289aF";
    jest.spyOn(userStorage, "getDID").mockReturnValue(null);
    jest.spyOn(axios, "get").mockResolvedValue({ status: 400 } as any);
    const issuerName = await issuer.getIssuerName(did);
    expect(issuerName).toMatch(did);
    jest.restoreAllMocks();
  });

  it("should return issuerDID when no response data from trustedIssuerRegistry", async () => {
    expect.assertions(1);
    const did = "did:ebsi:0x16048B83FAdaCdCB20198ABc45562Df1A3e289aF";
    jest.spyOn(userStorage, "getDID").mockReturnValue(null);
    jest.spyOn(axios, "get").mockResolvedValue({ status: 200 } as any);
    const issuerName = await issuer.getIssuerName(did);
    expect(issuerName).toMatch(did);
    jest.restoreAllMocks();
  });

  it("should return issuerDID when no response data name nor preferredName from trustedIssuerRegistry", async () => {
    expect.assertions(1);
    const did = "did:ebsi:0x16048B83FAdaCdCB20198ABc45562Df1A3e289aF";
    jest.spyOn(userStorage, "getDID").mockReturnValue(null);
    jest
      .spyOn(axios, "get")
      .mockResolvedValue({ status: 200, data: {} } as any);
    const issuerName = await issuer.getIssuerName(did);
    expect(issuerName).toMatch(did);
    jest.restoreAllMocks();
  });

  it("should return name", async () => {
    expect.assertions(1);
    const expectedIssuerName = "test userName";
    const did = "did:ebsi:0x16048B83FAdaCdCB20198ABc45562Df1A3e289aF";
    jest.spyOn(userStorage, "getDID").mockReturnValue(null);
    jest.spyOn(axios, "get").mockResolvedValue({
      status: 200,
      data: {
        issuerDID: did,
        entities: [
          {
            name: expectedIssuerName,
          },
        ],
      },
    } as any);
    const issuerName = await issuer.getIssuerName(did);
    expect(issuerName).toMatch(expectedIssuerName);
    jest.restoreAllMocks();
  });

  it("should return preferredName", async () => {
    expect.assertions(1);
    const expectedIssuerName = "test userName";
    const did = "did:ebsi:0x16048B83FAdaCdCB20198ABc45562Df1A3e289aF";
    jest.spyOn(userStorage, "getDID").mockReturnValue(null);
    jest.spyOn(axios, "get").mockResolvedValue({
      status: 200,
      data: {
        issuerDID: did,
        entities: [
          {
            preferredName: expectedIssuerName,
          },
        ],
      },
    } as any);
    const issuerName = await issuer.getIssuerName(did);
    expect(issuerName).toMatch(expectedIssuerName);
    jest.restoreAllMocks();
  });

  // Actually test the TIR API, without mocking
  it("should return the actual name", async () => {
    expect.assertions(1);
    // Get the first Trusted Issuer from the registry
    const url = `${REQUIRED_VARIABLES.TRUSTED_ISSUERS_REGISTRY_URL}`;
    const response = await axios.get(url);
    const firstIssuer = response.data.items[0];
    // Calling getIssuerName() with the issuer's DID should return its name
    const issuerName = await issuer.getIssuerName(firstIssuer.did);
    expect(issuerName).toMatch(firstIssuer.name);
  });
});

describe("getIssuer tests", () => {
  it("should return '-' when an error occurs", async () => {
    expect.assertions(1);
    const response = await issuer.getIssuer(undefined);
    expect(response).toMatch("-");
  });

  it("should return issuer from a presentation", async () => {
    expect.assertions(1);
    const credential = {
      name: "VerifiablePresentation",
      did: "did:ebsi:0x16048B83FAdaCdCB20198ABc45562Df1A3e289aF",
    };
    const expectedName = "TEST ISSUER";
    jest.spyOn(axios, "get").mockResolvedValue({
      status: 200,
      data: {
        issuerDID: "did:ebsi:0x123",
        entities: [
          {
            preferredName: expectedName,
          },
        ],
      },
    } as any);
    const response = await issuer.getIssuer(credential);

    expect(response).toMatch(expectedName);
    jest.restoreAllMocks();
  });

  it("should return issuer not from a presentation", async () => {
    expect.assertions(1);
    const issuerDID = "did:ebsi:0x16048B83FAdaCdCB20198ABc45562Df1A3e289aF";
    const dataToEncode = {
      issuer: issuerDID,
    };
    const encoded = base64url.encode(JSON.stringify(dataToEncode));
    const credential = {
      data: {
        base64: encoded,
      },
    };
    const expectedName = "TEST ISSUER";

    jest.spyOn(axios, "get").mockResolvedValue({
      status: 200,
      data: {
        issuerDID,
        entities: [
          {
            preferredName: expectedName,
          },
        ],
      },
    } as any);
    const response = await issuer.getIssuer(credential);

    expect(response).toMatch(expectedName);
    jest.restoreAllMocks();
  });
});
