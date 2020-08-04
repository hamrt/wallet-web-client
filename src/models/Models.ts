import { NotificationType } from "../dtos/notifications";

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
  receiver: "",
  message: {
    didOwner: "",
    notificationType: NotificationType.NONE,
    name: "",
    data: { base64: "" },
    hash: "",
    validationServiceEndpoint: "",
    timestamp: "",
  },

  selectedCredentials: [],
  selectedCredsTypes: [],
  dataDecoded: "",
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
export { credential, notification, vid, diploma };
