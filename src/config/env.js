const REQUIRED_VARIABLES = {
  PUBLIC_URL: process.env.PUBLIC_URL || "/",
  REACT_APP_WALLET:
    process.env.REACT_APP_WALLET || "http://localhost:8080/wallet",
  REACT_APP_WALLET_API:
    process.env.REACT_APP_WALLET_API || "http://localhost:9000/wallet",
  REACT_APP_ID_HUB_API:
    process.env.REACT_APP_ID_HUB_API || "http://localhost:9004/identity-hub",
  REACT_APP_EULOGIN:
    process.env.REACT_APP_EULOGIN || "https://ecas.acceptance.ec.europa.eu/cas",
  REACT_APP_DEMO: process.env.REACT_APP_DEMO || "http://localhost:8080/demo",
  EBSI_ENV:
    process.env.EBSI_ENV || process.env.REACT_APP_EBSI_ENV || "integration",
  DID_REGISTRY_SC_ADDRESS:
    process.env.DID_REGISTRY_SC_ADDRESS ||
    process.env.REACT_APP_DID_REGISTRY_SC_ADDRESS,
};

module.exports = REQUIRED_VARIABLES;
