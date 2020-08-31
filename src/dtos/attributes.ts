export interface IAttributeData {
  base64: string;
}

export interface IAttributeInfo {
  id: string;
  type: string[] | string;
  name: string;
  hash: string;
  did: string;
  dataDecoded?: string;
  issuer?: string;
}

export interface IAttribute extends IAttributeInfo {
  data: IAttributeData;
}
