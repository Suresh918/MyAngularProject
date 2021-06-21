import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';

@Injectable({
  'providedIn': 'root'
})

export class CaseActionService {

  constructor(private readonly httpService: HttpClient) {
  }

  isCaseActionAllowed(type: string, status: string, caseAction: string): boolean {
    if (type) {
      switch (type) {
        case 'CHANGEREQUEST':
          return this.isCaseActionAllowedOnChangeRequest(status, caseAction);
        case 'CHANGENOTICE':
          return this.isCaseActionAllowedOnChangeNotice(status, caseAction);
        case 'RELEASEPACKAGE':
          return this.isCaseActionAllowedOnReleasePackage(status, caseAction);
        default:
          return true;
      }
    }
  }

  isCaseActionAllowedOnChangeRequest(status: string, caseAction: string): boolean {
    const tempStatus = status ? status.toUpperCase() : '';
    const tempCaseAction = caseAction ? caseAction.toUpperCase() : '';
    return tempCaseAction === 'SAVE' && !(tempStatus === 'CLOSED' || tempStatus === 'REJECTED' ||
      tempStatus === 'OBSOLETED');
  }

  isCaseActionAllowedOnChangeNotice(status: string, caseAction: string): boolean {
    const tempStatus = status ? status.toUpperCase() : '';
    const tempCaseAction = caseAction ? caseAction.toUpperCase() : '';
    return tempCaseAction === 'SAVE' && !(tempStatus === 'IMPLEMENTED' || tempStatus === 'OBSOLETED');
  }

  isCaseActionAllowedOnReleasePackage(status: string, caseAction: string): boolean {
    const tempStatus = status ? status.toUpperCase() : '';
    const tempCaseAction = caseAction ? caseAction.toUpperCase() : '';
    return tempCaseAction === 'SAVE' && !(tempStatus === 'CLOSED' || tempStatus === 'OBSOLETED');
  }

  getCaseActionsForStatuses(): Observable<any> {
    // return this.httpService.get('../../shared/models/caseaction-status-mapping.json');
    return of({
      'ChangeRequest': [{'caseAction': 'REDRAFT', 'status': 'DRAFT'},
        {'caseAction': 'RESUBMIT', 'status': 'NEW'},
        {'caseAction': 'REDEFINE_SOLUTION', 'status': 'SOLUTION DEFINED'},
        {'caseAction': 'REANALYZE_IMPACT', 'status': 'IMPACT ANALYZED'}],
      'ChangeNotice': [{'caseAction': 'DEFINE', 'status': 'DRAFT'}, {
        'caseAction': 'SUBMIT',
        'status': 'NEW'
      }, {'caseAction': 'COMMIT', 'status': 'PLANNED'}, {
        'caseAction': 'RELEASE',
        'status': 'PLANNED'
      }, {'caseAction': 'CLOSE', 'status': 'IMPLEMENTED'}, {'caseAction': 'OBSOLETE', 'status': 'OBSOLETED'}],
      'ReleasePackage': [
        {'caseAction': 'RECREATE', 'status': 'CREATED'},
        {'caseAction': 'REREADY', 'status': 'READY FOR RELEASE'},
        {'caseAction': 'RELEASE', 'status': 'RELEASED'}]
    });
  }
}
