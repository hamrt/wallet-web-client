import PropTypes from "prop-types";

const credential = {
  id: "",
  name: "",
  hash: "",
  data: { base64: "" },
  type: [""],
  did: "",
  dataDecoded: "",
};
const notification = {
  id: "",
  sender: "",
  message: {
    notificationType: -1,
    name: [""],
    hash: "",
    data: { base64: "" },
    validationServiceEndpoint: "",
    didOwner: "",
  },
  receiver: "",
  timestamp: "",
  selectedCredentials: [],
  dataDecoded: "",
};
const credentialShape = {
  id: PropTypes.string,
  name: PropTypes.string,
  hash: PropTypes.string,
  data: PropTypes.shape({ base64: PropTypes.string }),
  type: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  did: PropTypes.string,
  dataDecoded: PropTypes.string,
};
const notificationShape = {
  id: PropTypes.string,
  sender: PropTypes.string,
  message: PropTypes.shape({
    notificationType: PropTypes.number,
    name: PropTypes.any,
    hash: PropTypes.string,
    data: PropTypes.shape({ base64: PropTypes.string }),
    validationServiceEndpoint: PropTypes.string,
    didOwner: PropTypes.string,
  }),
  receiver: PropTypes.string,
  timestamp: PropTypes.string,
  selectedCredentials: PropTypes.array,
  dataDecoded: PropTypes.string,
};

const vid = {
  personIdentifier: "",
  currentFamilyName: "",
  currentGivenName: "",
  birthName: "",
  dateOfBirth: "",
  currentAddress: "",
  gender: "",
  id: "",
  govId: "",
};

const diploma = {
  issuer: "",
  credentialSubject: {
    achievements: [
      {
        title: "",
        issuedDate: "",
        learningSpecification: {
          iscedFcode: "",
          hasAccreditation: { targetFramework: "" },
        },
        hasPart: [
          {
            wasDerivedFrom: {
              grade: { numericScore: "" },
            },
          },
        ],
      },
    ],
  },
};
export {
  credential,
  notification,
  credentialShape,
  notificationShape,
  vid,
  diploma,
};
