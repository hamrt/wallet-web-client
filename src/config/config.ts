const BESU_SERVICE_PATH = "/ledger/v1/blockchains/besu";

export const setBesu = () => {
  let ENVIRONMENT = process.env.EBSI_ENV;
  if (!ENVIRONMENT || ENVIRONMENT === "undefined")
    ENVIRONMENT = process.env.REACT_APP_EBSI_ENV;

  let provider;
  switch (ENVIRONMENT) {
    case "production":
      provider = `https://api.ebsi.tech.ec.europa.eu${BESU_SERVICE_PATH}`;
      break;
    case "development":
      provider = `https://api.ebsi.xyz${BESU_SERVICE_PATH}`;
      break;
    default:
      // integration by default
      provider = `https://api.intebsi.xyz${BESU_SERVICE_PATH}`;
  }

  let didRegistry = process.env.DID_REGISTRY_SC_ADDRESS;
  if (!didRegistry || didRegistry === "undefined")
    didRegistry = process.env.REACT_APP_DID_REGISTRY_SC_ADDRESS;
  if (!didRegistry || didRegistry === "undefined")
    throw new Error(
      "DID_REGISTRY_SC_ADDRESS or REACT_APP_DID_REGISTRY_SC_ADDRESS must be defined"
    );

  return {
    provider,
    didRegistry,
  };
};

const COMPONENT_WALLET_ID = "ebsi-wallet";

const DID_EBSI_SERVICES = {
  "did:ebsi:0xcDA56e98CD9e454143285b72b5De809e7C40C43F":
    "Sample Verifiable ID Issuer",
  "did:ebsi:0x66A3296A0adD02D841001dA1980b8DCAFF1d8d08":
    "Sample University - Bachelor's Programme",
  "did:ebsi:0xdC4b142388099C01348e26785e9AA45E75BD2e01":
    "Sample University - Master's Programme",
};

const NOTIFICATION_TYPE = {
  0: "Store My Diploma",
  1: "Store Verifiable eID",
  2: "Request your eID Presentation",
  3: "Request to Sign your eID Presentation",
  4: "Sign notarization ledger transaction",
};

const grantType = "urn:ietf:params:oauth:grant-type:jwt-bearer";
const scope = "ebsi profile user";
const besu = setBesu();

export {
  besu,
  COMPONENT_WALLET_ID,
  DID_EBSI_SERVICES,
  NOTIFICATION_TYPE,
  grantType,
  scope,
};
