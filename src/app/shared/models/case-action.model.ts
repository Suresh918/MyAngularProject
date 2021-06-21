import {EntityState} from '@ngrx/entity';

export class CaseAction {
  caseObjectID?: string;
  caseObjectRevision?: string;
  caseObjectType?: string;
  action?: string;
  isAllowed?: boolean;
  mandatoryParameters?: string[];
  id?: string;

  constructor(caseObjectID: string, caseObjectRevision: string, caseObjectType: string, isAllowed: boolean,
              action: string, mandatoryParameters: string[]) {
    this.caseObjectID = caseObjectID;
    this.caseObjectRevision = caseObjectRevision;
    this.caseObjectType = caseObjectType;
    this.action = action;
    this.isAllowed = isAllowed;
    if (mandatoryParameters) {
      this.mandatoryParameters = [...mandatoryParameters];
    }
    this.id = this.caseObjectID + this.caseObjectRevision + this.caseObjectType + this.action;
  }
}

export class CaseObjectReadOnly {
  caseObjectID?: string;
  caseObjectRevision?: string;
  caseObjectType?: string;
  readOnlyParameters?: string[];
  id?: string;

  constructor(caseObjectID: string, caseObjectRevision: string, caseObjectType: string, readOnlyParameters: string[]) {
    this.caseObjectID = caseObjectID;
    this.caseObjectRevision = caseObjectRevision;
    this.caseObjectType = caseObjectType;
    if (readOnlyParameters) {
      this.readOnlyParameters = [...readOnlyParameters];
    }
    this.id = this.caseObjectID + this.caseObjectRevision + this.caseObjectType;
  }
}

export class CaseObjectWriteOnly {
  caseObjectID?: string;
  caseObjectRevision?: string;
  caseObjectType?: string;
  writeAllowParameters?: string[];
  id?: string;

  constructor(caseObjectID: string, caseObjectRevision: string, caseObjectType: string, writeAllowParameters: string[]) {
    this.caseObjectID = caseObjectID;
    this.caseObjectRevision = caseObjectRevision;
    this.caseObjectType = caseObjectType;
    if (writeAllowParameters) {
      this.writeAllowParameters = [...writeAllowParameters];
    }
    this.id = this.caseObjectID + this.caseObjectRevision + this.caseObjectType;
  }
}

export interface CaseActionState extends EntityState<CaseAction> {
  selectedActionId: string | null;
}

export interface CaseObjectReadOnlyState extends EntityState<CaseObjectReadOnly> {
  selectedObjectId: string | null;
}

export interface CaseObjectWriteAllowedState extends EntityState<CaseObjectReadOnly> {
  selectedObjectId: string | null;
}
