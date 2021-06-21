export interface ErrorPayLoad {
  transactionIDs: string[];
  requestStack: RequestModel[];
  responseStack: ResponseModel[];
}

export interface RequestModel {
  url: string;
  method: string;
  request?: string;
}

export interface ResponseModel {
  'url': string;
  'http-code': string | number;
  'response'?: string;
}

export interface DeltaItem {
  'field'?: string;
  'label'?: string;
  'newValue'?: any;
  'oldValue'?: any;
  'newValueSelected'?: boolean;
  'oldValueSelected'?: boolean;
  oldObject?: any;
  newObject?: any;
}
