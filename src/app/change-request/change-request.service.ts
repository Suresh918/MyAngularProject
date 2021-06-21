import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {environment} from '../../environments/environment';
import {HelpersService} from '../core/utilities/helpers.service';
import {ChangeRequest} from '../shared/models/mc.model';
import {Problem} from '../shared/models/air.model';
import {ProductBreakdownStructure} from '../shared/models/product-breakdown-structure.model';
import {LinkObject, ReadOnlyCIASummary} from '../shared/models/mc-presentation.model';
import {ErrorResponse} from '../shared/models/mc-store.model';
import {AgendaItemDetail} from '../agenda/agenda.model';
import {FunctionalCluster} from '../shared/models/functional-cluster.model';
import {CaseObjectOverview} from '../shared/components/case-object-list/case-object-list.model';
import {Project} from '../shared/models/project.model';

@Injectable()
export class ChangeRequestService {
  rootServiceUrl: string;
  myImpactRootUrl: string;

  constructor(private readonly http: HttpClient, private readonly helpersService: HelpersService) {
    this.myImpactRootUrl = 'https://myproject-scm-dev.azure.bsnl.com/api/';
    this.rootServiceUrl = `${environment.rootURL}change-request-service`;
  }

  getChangeRequestDetails$(id: number): Observable<ChangeRequest> {
    const url = `${this.rootServiceUrl}/change-requests/${id}`;
    const qParams = {'view': 'change-request-detail'};
    return this.http.get(url, {params: qParams}).pipe(map(res => {
      return (res ? res : {}) as ChangeRequest;
    }));
  }

  fetchCrDetails(id: number): Observable<ChangeRequest> {
    const url = `${this.rootServiceUrl}/change-requests/${id}`;
    return this.http.get(url).pipe(map(res => {
      return (res ? res : {}) as ChangeRequest;
    }));
  }

  createChangeRequest$(): Observable<ChangeRequest> {
    const payload = {
      'description': {
        'title': 'New CR'
      }
    };
    return this.http.post(`${this.rootServiceUrl}/change-requests/aggregate`, payload).pipe(map(res => {
      return (res ? res : {}) as ChangeRequest;
    }));
  }

  updateChangeRequest$(id, action?: string): Observable<ChangeRequest> {
    const qParam = {'case-action': action};
    const url = `${this.rootServiceUrl}/change-requests/${id}`;
    return this.http.patch(url, null, {params: qParam}).pipe(map(res => {
      return (res ? res : {}) as ChangeRequest;
    }));
  }

  updateChangeRequestStatus$(changeRequestId: number, action?: string): Observable<ChangeRequest> {
    const qParams = {'action': action, 'revision': 'AA'};
    const url = `${this.rootServiceUrl}/change-requests/${changeRequestId}`;
    return this.http.put(url, '', {params: qParams}).pipe(map(res => {
      return (res && res['ChangeRequestElement'] ? res['ChangeRequestElement'] : {}) as ChangeRequest;
    }));
  }

  getObsoleteButtonVisibility(crId: string): Observable<any> {
    const qParams = {'view': 'is-first-draft'};
    const url = `${this.rootServiceUrl}/change-requests/${crId}`;
    return this.http.get(url, {params: qParams}).pipe(map(res => {
      return res ? res : null;
    }), catchError(err => {
      return of(null);
    }));
  }

  updateCustomerImpact$(caseObjectId: string, action: string, customerImpactObject: any, result): Observable<ChangeRequest> {
    const payload = {
      'CustomerImpactAnalysisElement': {
        'assessmentCriterias': customerImpactObject,
        'customerImpact': result
      }
    };
    const qParams = {'revision': 'AA', 'case-action': action};
    const url = `${this.rootServiceUrl}/change-requests/${caseObjectId}/customer-impact`;
    return this.http.put(url, payload, {params: qParams}).pipe(map(res => {
      return (res && res['ChangeRequestElement'] ? res['ChangeRequestElement'] : {}) as ChangeRequest;
    }));
  }

  updatePreInstallImpact$(caseObjectId: string, action: string, customerImpactObject: any, result): Observable<ChangeRequest> {
    const payload = {
      'PreInstallImpactAnalysisElement': {
        'assessmentCriterias': customerImpactObject,
        'preInstallImpact': result
      }
    };
    const qParams = {'revision': 'AA', 'case-action': action};
    const url = `${this.rootServiceUrl}/change-requests/${caseObjectId}/pre-install-impact`;
    return this.http.put(url, payload, {params: qParams}).pipe(map(res => {
      return (res && res['ChangeRequestElement'] ? res['ChangeRequestElement'] : {}) as ChangeRequest;
    }));
  }

  updatePreInstallImpactData$(id: string, payload: any): Observable<ChangeRequest> {
    const qParam = {'view' : 'change-request-detail'};
    const url = `${this.rootServiceUrl}/change-requests/preinstall-impact/${id}`;
    return this.http.put(url, payload, {params: qParam}).pipe(map(res => {
      return (res ? res : {}) as ChangeRequest;
    }));
  }

  getLinkedChangeNotice$(changeRequestId: string): Observable<CaseObjectOverview> {
    const qParam = {'view': 'linked-items'};
    const url = `${this.rootServiceUrl}/change-requests/${changeRequestId}`;
    return this.http.get(url, {params: qParam}).pipe(map(res => {
        return (res && res['ChangeNoticeSummaryElement'] ? res['ChangeNoticeSummaryElement'][0] : {}) as CaseObjectOverview;
      })
    );
  }

  updateMyTeamOnImpactItemChange$(id: string, payload: any) {
    const qParams = {
      'change-request-id': id
    };
    const url = `${this.rootServiceUrl}/change-requests/my-team/my-team-members`;
    return this.http.patch(url, payload, {params: qParams}).pipe(map(res => {
      return (res ? res['members'] : []) as any[];
    }));
  }

  linkAIRIssues(airItems, crID): Observable<any> {
    const qParam = {'case-action' : 'link-air'};
    const payload = {
      'sources': airItems
    };
    const url = `${this.rootServiceUrl}/change-requests/${crID}`;
    return this.http.put(url, payload, {params: qParam}).pipe(
      map(res => (res ? res : {})),
      catchError(() => of([]))
    );
  }

  linkPBSIssues(pbsItems, crID): Observable<any> {
    const qParam = {'case-action' : 'link-pbs'};
    const payload = {
      'sources': pbsItems
    };
    const url = `${this.rootServiceUrl}/change-requests/${crID}`;
    return this.http.put(url, payload, {params: qParam}).pipe(
      map(res => (res ? res : {})),
      catchError(() => of({})));
  }

  unlinkAIRIssue$(airIssueId: string, changeRequestId: string): Observable<Problem> {
    const qParam = {'case-action': 'unlink-air'};
    const linkedObject = {
      'LinkElement':
        {
          'ID': airIssueId,
          'type': 'AIR'
        }
    } as LinkObject;
    const url = `${environment.rootURL}mc${environment.version}/change-requests/${changeRequestId}`;
    return this.http.put(url, linkedObject, {params: qParam})
      .pipe(
        map(res => ({}) as Problem),
        catchError(err => of({'number': airIssueId, 'errorInServiceCall': this.getErrorMessage(err)} as Problem))
      );
  }

  linkChangeRequests(oldValue: string[], newValue: string[], changeRequestId: string): Observable<ChangeRequest> {
    const payload = {
      'oldIns': {
        'dependent_change_request_ids': oldValue
      },
      'newIns': {
        'dependent_change_request_ids': newValue
      }
    };
    const url = `${this.rootServiceUrl}/change-requests/${changeRequestId}`;
    return this.http.patch(url, payload).pipe(
      map(res => (res ? res : {}) as ChangeRequest),
      catchError(() => of(null as ChangeRequest))
    );
    return {} as Observable<ChangeRequest>;
  }

  unlinkChangeRequests(oldValue: string[], newValue: string[], changeRequestId: string): Observable<ChangeRequest> {
    const payload = {
      'oldIns': {
        'dependent_change_request_ids': oldValue
      },
      'newIns': {
        'dependent_change_request_ids': newValue
      }
    };
    const url = `${this.rootServiceUrl}/change-requests/${changeRequestId}`;
    return this.http.patch(url, payload).pipe(
      map(res => (res ? res : {}) as ChangeRequest),
      catchError(() => of(null as ChangeRequest))
    );
    return {} as Observable<ChangeRequest>;
  }

  getLinkedDecisions(id: string): Observable<AgendaItemDetail[]> {
    const url = `${environment.rootURL}mc${environment.version}/agenda-items/view/communication-object`;
    const qParams = {
      'case-type': 'ChangeRequest',
      'case-id': id
    };
    return this.http.get(url, {params: qParams}).pipe(
      map((res) => {
        return res ? res['CommunicationObjectSummaryElement'] : [];
      }, () => of([] as AgendaItemDetail[])));
  }

  getDecisionButtonStatus(id: string, status: string) {
    const url = `${environment.rootURL}mc${environment.version}/agenda-items/view/communication-status`;
    const qParams = {
      'case-type': 'ChangeRequest',
      'case-id': id,
      'case-status': status
    };
    return this.http.get(url, {params: qParams}).pipe(
      map((res) => {
        return res ? (res['ChangeObjectCommunicationSummaryElement'] ? res['ChangeObjectCommunicationSummaryElement']['communicationStatus'] : {}) : {};
      }, () => of({})));
  }

  updateImplementationRanges(id: string, revision: string, values: string[]): Observable<ChangeRequest> {
    const url = `${this.rootServiceUrl}/change-requests/${id}/implementation-range`;
    const qParams = {
      'revision': revision,
      'case-action': 'save',
      'implementation-ranges': values.toString()
    };
    return this.http.put(url, null, {params: qParams}).pipe(
      map((res) => {
        return res && res['ChangeRequestElement'] ? res['ChangeRequestElement'] : null;
      }, () => of()));
  }

  getFunctionalClusterOnCRID(id: string): Observable<FunctionalCluster> {
    return this.http.get(`${this.rootServiceUrl}/change-requests/${id}/functional-cluster`, {}).pipe(
      map((res) => ((res ? res : {}) as FunctionalCluster)
      ));
  }

  getAirListOnCRID(id: string): Observable<Problem[]> {
    return this.http.get(`${this.rootServiceUrl}/change-requests/${id}/problems`, {}).pipe(
      map(res => {
        return (res ? res : []) as Problem[];
      })
    );
  }

  getPBSListOnCRID(id: string): Observable<ProductBreakdownStructure[]> {
    return this.http.get(`${this.rootServiceUrl}/change-requests/${id}/product-breakdown-structures`, {}).pipe(
      map(res => {
        return (res ? res : []) as ProductBreakdownStructure[];
      }, catchError(() => {
        return of([]);
      }))
    );
  }

  saveDefineScope(scopeId: string, payload: any): Observable<ChangeRequest> {
    const qParam = {'view': 'change-request-detail'};
    const url = `${this.rootServiceUrl}/change-requests/scope/${scopeId}`;
    return this.http.put(url, payload, {params: qParam}).pipe(map(res => {
      return (res ? res : {}) as ChangeRequest;
    }));
  }

  getReadOnlyCIAData(id: string): Observable<ReadOnlyCIASummary> {
    const url = `${this.rootServiceUrl}/change-requests/${id}/customer-impact`;
    const qParam = {'view': 'details'};
    return this.http.get(url, {params: qParam}).pipe(
      map((res) => {
          return (res ? res : {}) as ReadOnlyCIASummary;
        }
      ));
  }

  getCIADependentFieldState$(id: string, servicePath: string) {
    const url = `${environment.rootURL}${servicePath}/${id}/scope-field-enablement`;
    return this.http.get(url).pipe(
      map((res) => {
          return (res ? res : {});
        }
      ));
  }

  getDocumentsByCRID(crID: string): Observable<any> {
    const url = `${this.rootServiceUrl}/change-requests/${crID}/documents`;
    return this.http.get(url).pipe(
      map((res) => {
          return (res ? res : {});
        }
      ));
  }

  getCRHisotry(caseObjectId: string, property: string): Observable<any> {
    const qParams = {
      ...(property ? {'property': property} : {}),
    };
    const url = `${this.rootServiceUrl}/change-requests/${caseObjectId}/change-log`;
    return this.http.get(url, {params: qParams});
  }

  getChangeRequestDocuments(caseObjectId, tagType): Observable<any> {
    const qParams = {
      ...((tagType !== 'TO-BE-PICTURE' || tagType !== 'AS-IS-PICTURE') ? {'view': 'categorized'} : {}),
      ...(tagType ? {'tag': tagType} : {}),
    };
    const url = `${this.rootServiceUrl}/change-requests/${caseObjectId}/documents`;
    return this.http.get(url, {params: qParams}).pipe(
      map(res => res ? res : [])
    );
  }

  uploadFile(caseObjectId: string, filePayload: FormData, tagType: string) {
    /*const qParams = {'tags': tagType};*/
    const url = `${this.rootServiceUrl}/change-requests/${caseObjectId}/documents`;
    return this.http.post(url, filePayload).pipe(
      map((res) => res),
      catchError(() => {
        return of(null);
      })
    );
  }

  updateFile(caseObjectId: string, filePayload: FormData, tagType: string) {
    const qParams = {'tag': tagType};
    const url = `${this.rootServiceUrl}/change-requests/${caseObjectId}/documents`;
    return this.http.put(url, filePayload, {params: qParams}).pipe(
      map((res) => res),
      catchError(() => {
        return of(null);
      })
    );
  }

  removeFile(caseObjectId: number) {
    const url = `${this.rootServiceUrl}/change-requests/documents/${caseObjectId}`;
    return this.http.delete(`${url}`);
  }

  getProjectDetails(caseObjectId: number): Observable<Project> {
    return this.http.get(`${this.rootServiceUrl}/change-requests/${caseObjectId}/project-details`).pipe(
      map(res => (res) ? res as Project : {} as Project)
    );
  }

  getCRCollaborationObjectCount(crID: string) {
    const qParams = {'view': 'collaboration-objects'};
    const url = `${this.rootServiceUrl}/change-requests/${crID}`;
    return this.http.get(url, {params: qParams}).pipe(map(res => {
      return res ? res : null;
    }), catchError(err => {
      return of(null);
    }));
  }

  getCRLinkedItemsCount(crID: string) {
    const url = `${environment.rootURL}mc${environment.version}/agenda-items/view/linked-collaboration-objects`;
    const qParams = {
      'link-type': 'ChangeRequest',
      'link-id': crID
    };
    return this.http.get(url, {params: qParams}).pipe(map(res => {
      return (res && res['CollaborationObjectsCountElement']) ? res['CollaborationObjectsCountElement'] : null;
    }), catchError(err => {
      return of(null);
    }));
  }

  getCRObsoletedObjectCount(): Observable<any> {
    const qParam = {
      'view': 'status-count',
      'status': '8'
    };
    const url = `${this.rootServiceUrl}/change-requests`;
    return this.http.get(url, {params: qParam}).pipe(
      map((res) => res ? res : null),
      catchError(() => {
        return of(null);
      })
    );
  }

  getTrackerboardSummaryForCr(filterQuery: string): Observable<any> {
    const url = `${this.rootServiceUrl}/change-requests`;
    const qParams = {
      view: 'trackerboard-summary',
      ...(filterQuery ? {'view-criteria': filterQuery} : {})
    };
    return this.http.get(url, {params: qParams}).pipe(
      map((res) => res ? res : []),
      catchError(() => {
        return of([]);
      })
    );
  }

  getChangeRequestSearchSummary(startPosition, numberOfItems, searchParameters?: any) {
    const url = `${this.rootServiceUrl}/change-requests`;
    const qParams = {
      'view': 'search-summary',
      'page': startPosition,
      'size': numberOfItems,
      ...(searchParameters && searchParameters.group ? {'view-criteria': searchParameters.group} : {}),
      ...(searchParameters && searchParameters.keywords ? searchParameters.group ? {'view-criteria': searchParameters.group.concat(' and ').concat(searchParameters.keywords)} :
        {'view-criteria': searchParameters.keywords} : {}),
      ...(searchParameters && searchParameters.changeSpecialist1 ? {'criteria': searchParameters.changeSpecialist1} : {}),
      ...(searchParameters && searchParameters.changeSpecialist2 ? {'criteria': searchParameters.changeSpecialist2} : {}),
      ...(searchParameters && searchParameters.status ? searchParameters.changeSpecialist1 ? {'criteria': searchParameters.status.concat(' and ').concat(searchParameters.changeSpecialist1)} :
        searchParameters.changeSpecialist2 ? {'criteria': searchParameters.status.concat(' and ').concat(searchParameters.changeSpecialist2)} : {'criteria': searchParameters.status} : {}),
    };
    return this.http.get(url, {params: qParams}).pipe(map(res => {
      return res ? res : [];
    }), catchError(() => {
      return of({});
    }));
  }

  // Change service URL when available

  getUncommunicatedOfflineDecisionStatus(crIds: number[]) {
    const url = `${environment.rootURL}mc${environment.version}/agenda-items/view/uncommunicated-offline-decision`;
    const qParams = {
      'cr-ids': crIds.join(',')
    };
    return this.http.get(url, {params: qParams}).pipe(
      map(res => res && res['OfflineDecisionSummary'] ? res['OfflineDecisionSummary'] : []),
    );
  }

  updateCBRuleSetForCr(oldRuleSetElement, newRuleSetElement, changeRequestId): Observable<any> {
    const payload = {
      'oldIns': {
        'change_board_rule_set': oldRuleSetElement
      },
      'newIns': {
        'change_board_rule_set': newRuleSetElement
      }
    };
    const url = `${this.rootServiceUrl}/change-requests/${changeRequestId}`;
    return this.http.patch(url, payload).pipe(
      map(res => (res && res['change_board_rule_set'] ? res['change_board_rule_set'] : {})),
      catchError(() => of({}))
    );
  }

  updateChangeOwnerType(caseObjectId, oldChangeOwnerType, newChangeOwnerType, caseObjectPath): Observable<any> {
    const payload = {
      'oldIns': {
        'change_owner_type': oldChangeOwnerType
      },
      'newIns': {
        'change_owner_type': newChangeOwnerType
      }
    };
    const url = `${environment.rootURL}${caseObjectPath}/${caseObjectId}`;
    return this.http.patch(url, payload).pipe(map(res => {
      return (res ? res : {});
    }), catchError((err) => {
      return of(err);
    }));
  }

  private getErrorMessage(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      return 'An error occurred: ' + error.error.message;
    } else if (error.error && (error.error as ErrorResponse).Detail && (error.error as ErrorResponse).Detail.Message) {
      // The backend returned an unsuccessful response code.
      const txId = (error.error as ErrorResponse).TransactionID;
      return 'An error occurred: ' + (error.error as ErrorResponse).Detail.Message.replace('@TxId@',
        (error.error as ErrorResponse).TransactionID);
    } else {
      return 'An unhandled error occurred: Some static message';
    }
  }

  public getChangeRequestOverviewDetails(changeRequestId: string): Observable<any> {
    const url = `${this.rootServiceUrl}/change-requests`;
    const qParams = {'view': 'overview', 'criteria': `id:${changeRequestId}`};
    return this.http.get(url, {params: qParams});
  }

  public getSciaList(changeRequestId: string): Observable<any> {
    const url = `${this.rootServiceUrl}/change-requests/${changeRequestId}/scias`;
      return this.http.get(url);
  }

  public createScia(changeRequestId: string, payload): Observable<any> {
    const url = `${this.rootServiceUrl}/change-requests/${changeRequestId}/scias`;
    return this.http.patch(url, payload)
      .pipe(map(res => {
        return (res ? res : {});
    }));
  }

  public copyScia(changeRequestId: string, sciaId: string): Observable<any> {
    const url = `${this.rootServiceUrl}/change-requests/${changeRequestId}/scias?scia-id=${sciaId}`;
      return this.http.patch(url, {});
  }

}
