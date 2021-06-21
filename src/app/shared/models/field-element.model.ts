import {ChangeRequest} from './mc.model';

export class FieldElement {
  ID: string;
  oldValue: any;
  newValue: any;
  response: FieldElementUpdateDetail;

  constructor(ID: string, oldValue: any, newValue: any) {
    this.ID = ID;
    this.newValue = newValue;
    this.oldValue = oldValue;
  }
}

export class ListFieldElement {
  ID: string;
  oldValues: any[];
  newValues: any[];
  response: FieldElementUpdateDetail;

  constructor(ID: string, oldValues: any[], newValues: any[]) {
    this.ID = ID;
    this.newValues = newValues;
    this.oldValues = oldValues;
  }
}

export class FieldElementUpdateDetail {
  status: string;
  statusCode: string;
  details: string;
  severity: number;

  constructor(status: string, code: string, message: string, severity: number) {
    this.status = status;
    this.statusCode = code;
    this.details = message;
    this.severity = severity;
  }
}


export class UpdateFieldRequest {
  FieldElement: FieldElement [];
  ListFieldElement: ListFieldElement [];
  constructor(fieldElement: FieldElement [], listFieldElement: ListFieldElement []) {
    this.FieldElement = fieldElement;
    this.ListFieldElement = listFieldElement;
  }
}

export class UpdateFieldResponse {
  FieldElement: FieldElement [];
  ChangeRequestElement: ChangeRequest;
}

export class UpdateInstanceRequest {
  oldIns: Object;
  newIns: Object;
  constructor(oldIns: Object, newIns: Object) {
    this.oldIns = oldIns;
    this.newIns = newIns;
  }
}

