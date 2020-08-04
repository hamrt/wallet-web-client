export enum NotificationType {
  STORE_CREDENTIAL,
  STORE_VERIFIABLEID,
  REQUEST_PRESENTATION,
  SIGN_PAYLOAD,
  SIGN_TX,
  NONE = -1,
}

export interface INotiData {
  base64: string;
}

export interface INotification {
  id: string;
  sender: string;
  receiver: string;
  message: {
    didOwner: string;
    notificationType: NotificationType;
    name: string;
    data: INotiData;
    hash: string;
    subscriberURL?: string;
    validationServiceEndpoint?: string;
    redirectURL?: string;
    issuer?: string;
    timestamp?: string;
  };
  selectedCredentials: string[];
  selectedCredsTypes: string[][];
  dataDecoded?: string;
}

export interface NotificationsOptions {
  signature?: string;
  selectedCredentials?: string[];
}
