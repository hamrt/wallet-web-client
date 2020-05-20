// CONFIG PROJECT FILE
import * as dotenv from "dotenv";
import { setBesu } from "./config";
// importing .env variables
dotenv.config();

describe("test environment variables", () => {
  test.each`
    env              | url
    ${"production"}  | ${"https://api.ebsi.tech.ec.europa.eu/ledger/v1/blockchains/besu"}
    ${"development"} | ${"https://api.ebsi.xyz/ledger/v1/blockchains/besu"}
    ${"integration"} | ${"https://api.intebsi.xyz/ledger/v1/blockchains/besu"}
    ${"local"}       | ${"https://api.intebsi.xyz/ledger/v1/blockchains/besu"}
  `(
    "should set the besu service provider: $url with REACT_APP_EBSI_ENV set to $env",
    async ({ env, url }) => {
      jest.resetModules();
      process.env.EBSI_ENV = undefined;
      process.env.REACT_APP_EBSI_ENV = env;
      process.env.DID_REGISTRY_SC_ADDRESS = "0x00";
      expect(setBesu().provider).toMatch(url);
    }
  );
  test.each`
    env              | url
    ${"production"}  | ${"https://api.ebsi.tech.ec.europa.eu/ledger/v1/blockchains/besu"}
    ${"development"} | ${"https://api.ebsi.xyz/ledger/v1/blockchains/besu"}
    ${"integration"} | ${"https://api.intebsi.xyz/ledger/v1/blockchains/besu"}
    ${"local"}       | ${"https://api.intebsi.xyz/ledger/v1/blockchains/besu"}
  `(
    "should set the besu service provider: $url with EBSI_ENV set to $env",
    async ({ env, url }) => {
      jest.resetModules();
      process.env.REACT_APP_EBSI_ENV = undefined;
      process.env.EBSI_ENV = env;
      process.env.DID_REGISTRY_SC_ADDRESS = "0x00";
      expect(setBesu().provider).toMatch(url);
    }
  );
  test.each`
    scAddress   | expected
    ${"0001"}   | ${"0001"}
    ${"0x0001"} | ${"0x0001"}
  `(
    "should set the besu service sc address REACT_APP_DID_REGISTRY_SC_ADDRESS: $scAddress and receive $expected",
    async ({ scAddress, expected }) => {
      jest.resetModules();
      process.env.DID_REGISTRY_SC_ADDRESS = undefined;
      process.env.REACT_APP_DID_REGISTRY_SC_ADDRESS = scAddress;
      expect(setBesu().didRegistry).toMatch(expected);
    }
  );

  it("should set ENVIRONMENT to 'integration' when no ENV is defined", () => {
    expect.assertions(1);
    jest.resetModules();
    process.env.REACT_APP_EBSI_ENV = undefined;
    process.env.EBSI_ENV = undefined;
    process.env.DID_REGISTRY_SC_ADDRESS = "0x00";
    expect(setBesu().provider).toMatch(
      "https://api.intebsi.xyz/ledger/v1/blockchains/besu"
    );
  });

  test.each`
    scAddress   | expected
    ${"0001"}   | ${"0001"}
    ${"0x0001"} | ${"0x0001"}
  `(
    "should set the besu service sc address DID_REGISTRY_SC_ADDRESS: $scAddress and receive $expected",
    async ({ scAddress, expected }) => {
      jest.resetModules();
      process.env.DID_REGISTRY_SC_ADDRESS = scAddress;
      process.env.REACT_APP_DID_REGISTRY_SC_ADDRESS = undefined;
      expect(setBesu().didRegistry).toMatch(expected);
    }
  );
  it("should throw an error when DID_REGISTRY_SC_ADDRESS and REACT_APP_DID_REGISTRY_SC_ADDRESS are not defined", () => {
    expect.assertions(1);
    process.env.DID_REGISTRY_SC_ADDRESS = undefined;
    process.env.REACT_APP_DID_REGISTRY_SC_ADDRESS = undefined;
    expect(() => setBesu().didRegistry).toThrow(
      "DID_REGISTRY_SC_ADDRESS or REACT_APP_DID_REGISTRY_SC_ADDRESS must be defined"
    );
  });
});
