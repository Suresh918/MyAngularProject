import {Injectable} from '@angular/core';
import {CaseObject} from '../../shared/models/mc.model';

@Injectable({
  'providedIn': 'root'
})
export class StoreHelperService {
  getButtonSelector(type: string, action: string, id: string, revision: string) {
    return {
      actionData: {
        type: type,
        action: action,
        caseObjectId: id,
        revision: revision
      }
    };
  }

  getFieldSelector(fieldId: string, type: string, id: string, revision: string) {
    return {
      fieldData: {
        fieldId: fieldId,
        caseObject: new CaseObject(id, revision, type)
      }
    };
  }
}
