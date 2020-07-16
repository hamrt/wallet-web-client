import env from "./env";

const COMPONENT_WALLET_ID = "ebsi-wallet";

const NOTIFICATION_TYPE = [
  "Store My Diploma",
  "Store Verifiable eID",
  "Request your eID Presentation",
  "Request to Sign your eID Presentation",
  "Sign ledger transaction",
];

const grantType = "urn:ietf:params:oauth:grant-type:jwt-bearer";
const scope = "ebsi profile user";
const besu = {
  provider: env.BESU_URL,
  didRegistry: env.DID_REGISTRY_SC_ADDRESS,
};

export { besu, COMPONENT_WALLET_ID, NOTIFICATION_TYPE, grantType, scope };
