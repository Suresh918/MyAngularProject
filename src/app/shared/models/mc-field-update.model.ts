import {EntityState} from '@ngrx/entity';
import {CaseObject} from './mc.model';

export class FieldUpdateData {
  fieldId: string;
  tab?: number;
  caseObject?: CaseObject;
  serviceStatus?: string;
  mandatoryState?: string;
  id?: string;
  errorInfo?: any;

  constructor(data: FieldUpdateData) {
    this.caseObject = data.caseObject;
    this.fieldId = data.fieldId;
    this.tab = data.tab;
    this.serviceStatus = data.serviceStatus;
    this.mandatoryState = data.mandatoryState;
    this.errorInfo = data.errorInfo;
    this.id = this.fieldId + this.caseObject.ID + this.caseObject.type;
  }
}

export interface FieldDataState extends EntityState<FieldUpdateData> {
  selectedActionId: string | null;
}
