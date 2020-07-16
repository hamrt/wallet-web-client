const { REACT_APP_EBSI_ENV, REACT_APP_DID_REGISTRY_SC_ADDRESS } = process.env;

if (!REACT_APP_EBSI_ENV) {
  throw new Error("REACT_APP_EBSI_ENV must be defined");
}

if (
  !["local", "integration", "development", "production"].includes(
    REACT_APP_EBSI_ENV
  )
) {
  throw new Error(
    `REACT_APP_EBSI_ENV has an unknown value: ${REACT_APP_EBSI_ENV}`
  );
}

if (!REACT_APP_DID_REGISTRY_SC_ADDRESS) {
  throw new Error("REACT_APP_DID_REGISTRY_SC_ADDRESS must be defined");
}

const environment =
  process.env.REACT_APP_EBSI_ENV === "production" ||
  process.env.REACT_APP_EBSI_ENV === "development" ||
  process.env.REACT_APP_EBSI_ENV === "local"
    ? process.env.REACT_APP_EBSI_ENV
    : "integration"; // integration by default

const defaultConfig = {
  local: {
    REACT_APP_WALLET: "http://localhost:8080/wallet",
    REACT_APP_WALLET_API: "http://localhost:9000/wallet",
    REACT_APP_ID_HUB_API: "http://localhost:9004/identity-hub",
    REACT_APP_DEMO: "https://app.intebsi.xyz/demo",
    BESU_URL: "https://api.intebsi.xyz/ledger/v1/blockchains/besu",
    trustedIssuersRegistryUrl:
      "https://api.intebsi.xyz/trusted-issuers-registry/v1/issuers",
  },
  integration: {
    REACT_APP_WALLET: "https://app.intebsi.xyz/wallet",
    REACT_APP_WALLET_API: "https://api.intebsi.xyz/wallet",
    REACT_APP_ID_HUB_API: "https://api.intebsi.xyz/identity-hub",
    REACT_APP_DEMO: "https://app.intebsi.xyz/demo",
    BESU_URL: "https://api.intebsi.xyz/ledger/v1/blockchains/besu",
    trustedIssuersRegistryUrl:
      "https://api.intebsi.xyz/trusted-issuers-registry/v1/issuers",
  },
  development: {
    REACT_APP_WALLET: "https://app.ebsi.xyz/wallet",
    REACT_APP_WALLET_API: "https://api.ebsi.xyz/wallet",
    REACT_APP_ID_HUB_API: "https://api.ebsi.xyz/identity-hub",
    REACT_APP_DEMO: "https://app.ebsi.xyz/demo",
    BESU_URL: "https://api.ebsi.xyz/ledger/v1/blockchains/besu",
    trustedIssuersRegistryUrl:
      "https://api.ebsi.xyz/trusted-issuers-registry/v1/issuers",
  },
  production: {
    REACT_APP_WALLET: "https://app.ebsi.tech.ec.europa.eu/wallet",
    REACT_APP_WALLET_API: "https://api.ebsi.tech.ec.europa.eu/wallet",
    REACT_APP_ID_HUB_API: "https://api.ebsi.tech.ec.europa.eu/identity-hub",
    REACT_APP_DEMO: "https://app.ebsi.tech.ec.europa.eu/demo",
    BESU_URL: "https://api.ebsi.tech.ec.europa.eu/ledger/v1/blockchains/besu",
    trustedIssuersRegistryUrl:
      "https://api.ebsi.tech.ec.europa.eu/trusted-issuers-registry/v1/issuers",
  },
};

const env = {
  PUBLIC_URL: process.env.PUBLIC_URL || "/",
  REACT_APP_WALLET:
    process.env.REACT_APP_WALLET || defaultConfig[environment].REACT_APP_WALLET,
  REACT_APP_WALLET_API:
    process.env.REACT_APP_WALLET_API ||
    defaultConfig[environment].REACT_APP_WALLET_API,
  REACT_APP_ID_HUB_API:
    process.env.REACT_APP_ID_HUB_API ||
    defaultConfig[environment].REACT_APP_ID_HUB_API,
  REACT_APP_DEMO:
    process.env.REACT_APP_DEMO || defaultConfig[environment].REACT_APP_DEMO,
  REACT_APP_EULOGIN:
    process.env.REACT_APP_EULOGIN || "https://ecas.acceptance.ec.europa.eu/cas",
  EBSI_ENV: REACT_APP_EBSI_ENV || "development",
  REACT_APP_DID_REGISTRY_SC_ADDRESS,
  BESU_URL: defaultConfig[environment].BESU_URL,
  DID_REGISTRY_SC_ADDRESS: REACT_APP_DID_REGISTRY_SC_ADDRESS,
  trustedIssuersRegistryUrl:
    defaultConfig[environment].trustedIssuersRegistryUrl,
};

export default env;
