export interface PresentationInputCall {
  issuer: string;
  type: string[][];
  subscriberURL: string;
  redirectURL?: string;
}

export interface PresentationCredentialCall extends PresentationInputCall {
  credentials: string[];
}

const presentationInputFromJSON = (json: any): PresentationInputCall => {
  if (!json) throw new Error("No data provided");
  return {
    issuer: json.issuer,
    type: json.type,
    subscriberURL: json.subscriberURL,
    redirectURL: json.redirectURL,
  };
};

export { presentationInputFromJSON };
