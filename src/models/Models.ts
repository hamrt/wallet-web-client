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

export { credential, notification };
