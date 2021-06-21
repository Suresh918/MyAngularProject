import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {ChangeRequestList} from 'app/change-request/change-request-list/change-request-list.model';
import {ChangeNoticeList} from 'app/change-notice/change-notice-list/change-notice-list.model';
import {ReleasePackageList} from 'app/release-package/release-package.model';
import {CaseObjectOverviewElement, CaseObjectStateAnalytics} from 'app/shared/components/case-object-list/case-object-list.model';
import {ActionSummary, CaseObjectLinkedItemsCount, Categories, GlobalSearchResponse} from '../../shared/models/mc-presentation.model';

@Injectable({
  'providedIn': 'root'
})

export class CaseObjectListService {
  constructor(private readonly http: HttpClient) {
  }

  getChangeRequestList$(startPosition: number, numberOfItems: number, filter?: string, orderBy?: string): Observable<ChangeRequestList> {
    const url = `${environment.rootURL}mc${environment.version}/change-requests/view/summary`;
    const qParams = {
      'start-position': '' + startPosition,
      'number-of-items': '' + numberOfItems,
      ...(filter ? {'filter': '' + filter} : {}),
      ...(orderBy ? {'order-by': '' + orderBy} : {})
    };
    return this.http.get(url, {params: qParams}).pipe(
      map(response => {
        return {
          totalItems: (response && response['totalItems']) ? response['totalItems'] : 0,
          changeRequestSummaries: (response && response['ChangeRequestSummaryElement']) ? response['ChangeRequestSummaryElement'] : []
        } as ChangeRequestList;
      }), catchError(() => {
        return of({} as ChangeRequestList);
      }));
  }

  getChangeNoticeList$(startPosition, numberOfItems, filter?, orderBy?): Observable<ChangeNoticeList> {
    const url = `${environment.rootURL}mc${environment.version}/change-notices/view/summary`;
    const qParams = {
      'start-position': startPosition,
      'number-of-items': numberOfItems,
      ...(filter ? {'filter': filter} : {}),
      ...(orderBy ? {'order-by': orderBy} : {})
    };

    return this.http.get(url, {params: qParams}).pipe(
      map(response => {
          return {
            totalItems: (response && response['totalItems']) ? response['totalItems'] : 0,
            changeNoticeSummaries: (response && response['ChangeNoticeSummaryElement']) ? response['ChangeNoticeSummaryElement'] : []
          } as ChangeNoticeList;
        }
      ), catchError(() => {
        return of({
          'totalItems': 0,
          'changeNoticeSummaries': []
        } as ChangeNoticeList);
      }));
  }

  getReleasePackageList$(startPosition, numberOfItems, filter?, orderBy?): Observable<ReleasePackageList> {
    const url = `${environment.rootURL}mc${environment.version}/release-packages/view/summary`;
    const qParams = {
      'start-position': startPosition,
      'number-of-items': numberOfItems,
      ...(filter ? {'filter': filter} : {}),
      ...(orderBy ? {'order-by': orderBy} : {})
    };

    return this.http.get(url, {params: qParams}).pipe(
      map(response => {
          return {
            totalItems: (response && response['totalItems']) ? response['totalItems'] : 0,
            releasePackageSummaries: (response && response['ReleasePackageSummaryElement']) ? response['ReleasePackageSummaryElement'] : []
          } as ReleasePackageList;
        }
      ), catchError(() => {
        return of({
          'totalItems': 0,
          'releasePackageSummaries': []
        } as ReleasePackageList);
      }));
  }

  getCaseObjectStatusCardDetails(caseObjectType, startPosition, numberOfItems, filter, orderBy): Observable<CaseObjectStateAnalytics[]> {
    const path = (caseObjectType === 'actions') ? 'count-per-status-by-expiry' : (caseObjectType === 'release-packages' || caseObjectType === 'agendas') ? 'status' : 'actions-count';
    const url = `${environment.rootURL}mc${environment.version}/${caseObjectType}/view/${path}`;
    const qParams = {
      'start-position': startPosition,
      ...(filter ? {'filter': filter} : {}),
      ...(orderBy ? {'order-by': orderBy} : {})
    };
    return this.http.get(url, {params: qParams}).pipe(map(res => {
      if (res && res['ReleasePackageDatesActionsCountElement']) {
        return res['ReleasePackageDatesActionsCountElement'] ? res['ReleasePackageDatesActionsCountElement'] : [];
      } else if (res && res['AgendaCountElement']) {
        return res['AgendaCountElement'] ? res['AgendaCountElement'] : [];
      } else if (res && res['ActionCountOverviewElement']) {
        return res['ActionCountOverviewElement'] ? res['ActionCountOverviewElement'] : [];
      } else {
        return res['CountOverviewElement'] ? res['CountOverviewElement'] : [];
      }
    }), catchError(() => {
      return of([] as CaseObjectStateAnalytics[]);
    }));
  }

  getCaseObjectStateCount(caseObjectServicePath, filter, viewQuery): Observable<CaseObjectStateAnalytics[]> {
    const url = `${environment.rootURL}${caseObjectServicePath}`;
    const qParams = {
      'view': 'state-overview',
      ...(filter ? {'criteria': filter} : {}),
      ...(viewQuery ? {'view-criteria': viewQuery} : {})
    };
    return this.http.get(url, {params: qParams}).pipe(map(res => {
      return res && res['state_counts'] ? res['state_counts'] : [];
    }), catchError(() => {
      return of([]);
    }));
  }

  getCaseObjectStatusCount(caseObjectServicePath, filter, viewQuery): Observable<any> {
    const url = `${environment.rootURL}${caseObjectServicePath}`;
    const qParams = {
      'view': 'status-count',
      ...(filter ? {'criteria': filter} : {}),
      ...(viewQuery ? {'view-criteria': viewQuery} : {})
    };
    return this.http.get(url, {params: qParams}).pipe(map(res => {
      return res && res['status_counts'] ? res['status_counts'] : [];
    }), catchError(() => {
      return of([]);
    }));
  }


  getOverviewSummary$(caseObjectServicePath, startPosition, numberOfItems, filterQuery?, viewQuery?, sort?): Observable<any> {
    const url = `${environment.rootURL}${caseObjectServicePath}`;
    const qParams = {
      'view': url.indexOf('change-requests') > -1 ? 'change-request-list' : url.indexOf('release-package') > -1 ? 'release-package-list' : 'overview',
      'slice-select': 'results',
      'page': startPosition,
      'size': numberOfItems,
      ...(filterQuery ? {'criteria': filterQuery} : {}),
      ...(viewQuery ? {'view-criteria': viewQuery} : {}),
      ...(sort ? {'sort': sort} : {})
    };
    return this.http.get(url, {params: qParams}).pipe(map(res => {
        return res ? res : null;
      })
    );
  }

  getOverviewCount(caseObjectServicePath, filterQuery?, viewQuery?, sort?): Observable<any> {
    const url = `${environment.rootURL}${caseObjectServicePath}`;
    const qParams = {
      'view': url.indexOf('change-requests') > -1 ? 'change-request-list' : url.indexOf('release-package') > -1 ? 'release-package-list' : 'overview',
      'slice-select': 'total-results',
      ...(filterQuery ? {'criteria': filterQuery} : {}),
      ...(viewQuery ? {'view-criteria': viewQuery} : {}),
      ...(sort ? {'sort': sort} : {})
    };
    return this.http.get(url, {params: qParams}).pipe(map(res => {
        return res ? res : null;
      })
    );
  }

  getCaseObjectOverviewSummary$(caseObjectType, startPosition, numberOfItems, hasPagination?, filter?, orderBy?): Observable<CaseObjectOverviewElement> {
    const url = `${environment.rootURL}mc${environment.version}/${caseObjectType}/view/overview`;
    const qParams = {
      ...(hasPagination ? {'start-position': startPosition} : {}),
      ...(hasPagination ? {'number-of-items': numberOfItems} : {}),
      ...(filter ? {'filter': filter} : {}),
      ...(orderBy ? {'order-by': orderBy} : {})
    };
    const caseObjectOverviewElement = {} as CaseObjectOverviewElement;
    return this.http.get(url, {params: qParams}).pipe(map(res => {
        if (res && res['ChangeRequestSummaryElement']) {
          caseObjectOverviewElement.caseObjectOverViewList = res['ChangeRequestSummaryElement'];
        } else if (res && res['ChangeNoticeSummaryElement']) {
          caseObjectOverviewElement.caseObjectOverViewList = res['ChangeNoticeSummaryElement'];
        } else if (res && res['ReleasePackageOverviewElement']) {
          caseObjectOverviewElement.caseObjectOverViewList = res['ReleasePackageOverviewElement'];
        } else {
          caseObjectOverviewElement.caseObjectOverViewList = [];
        }
        caseObjectOverviewElement.totalItems = res['TotalItems'];
        return caseObjectOverviewElement;
      }), catchError(() => {
        return of({'caseObjectOverViewList': [], 'totalItems': 0} as CaseObjectOverviewElement);

      })
    );
  }

  getSearchResults$(startPosition, numberOfItems, searchString, type?, searchParameters?: any, sortString?: string): Observable<GlobalSearchResponse> {
    const url = `${environment.rootURL}mc${environment.version}/cases/view/search`;
    const qParams = {
      ...(sortString ? {'order-by': sortString} : {}),
      'start-position': startPosition,
      'number-of-items': numberOfItems,
      ...(searchString ? {'search': searchString} : {}),
      ...(type ? {'type': type} : {}),
      ...(searchParameters && searchParameters.status ? {'status': searchParameters.status} : {}),
      ...(searchParameters && searchParameters.group ? {'group': searchParameters.group} : {}),
      ...(searchParameters && searchParameters.changeSpecialist1 ? {'change-specialist-1': searchParameters.changeSpecialist1} : {}),
      ...(searchParameters && searchParameters.changeSpecialist2 ? {'change-specialist-2': searchParameters.changeSpecialist2} : {}),
      ...(searchParameters && searchParameters.excludeCRList ? {'exclude-cr-list': searchParameters.excludeCRList} : {}),
      ...(searchParameters && searchParameters.excludeCNList ? {'exclude-cn-list': searchParameters.excludeCNList} : {}),
      ...(searchParameters && searchParameters.hasOfflineDecision ? {'has-offline-decision': searchParameters.hasOfflineDecision} : {}),
      ...(searchParameters && searchParameters.category ? {'group-type': searchParameters.category} : {}),
      ...(searchParameters  && searchParameters.excludeObsoleted ? {'exclude-obsoleted': searchParameters.excludeObsoleted} : {})
    };
    return this.http.get(url, {params: qParams}).pipe(map(res => {
      return res ? res : [];
    }), catchError(() => {
      return of([] as any);
    }));
  }

  getGlobalSearchResults$(startPosition, numberOfItems, searchString): Observable<GlobalSearchResponse> {
    const url = `${environment.rootURL}mc${environment.version}/cases/view/global-search`;
    const qParams = {
      'start-position': startPosition,
      'number-of-items': numberOfItems,
      ...(searchString ? {'search': searchString} : {}),
    };
    return this.http.get(url, {params: qParams}).pipe(map(res => {
      return res ? res : [];
    }), catchError(() => {
      return of([] as any);
    }));
  }

  getCRGlobalSearchResults$(startPosition, numberOfItems, searchString): Observable<GlobalSearchResponse> {
    const url = `${environment.rootURL}change-request-service/change-requests`;
    const qParams = {
      'view': 'global-search',
      'view-criteria': `change_request_number:"*${searchString}*" or title:"*${searchString}*"`,
      'start-position': startPosition,
      'number-of-items': numberOfItems,
    };
    return this.http.get(url, {params: qParams}).pipe(map(res => {
      return res ? res : [];
    }), catchError(() => {
      return of([] as any);
    }));
  }

  getRPGlobalSearchResults$(startPosition, numberOfItems, searchString): Observable<GlobalSearchResponse> {
    const url = `${environment.rootURL}release-package-service/release-packages`;
    const qParams = {
      'view': 'global-search',
      'view-criteria': `release_package_number:"*${searchString}*" or title:"*${searchString}*" or ecn_number:"*${searchString}*"`,
      'start-position': startPosition,
      'number-of-items': numberOfItems,
    };
    return this.http.get(url, {params: qParams}).pipe(map(res => {
      return res ? res : [];
    }), catchError(() => {
      return of([] as any);
    }));
  }

  getCaseObjectActionSummaries$(linkItem, revision, type, filter?, orderBy?): Observable<ActionSummary[]> {
    const url = `${environment.rootURL}mc${environment.version}/actions/view/action-summaries`;
    const qParams = {
      'link-id': linkItem,
      'link-type': type,
      ...(revision ? {'link-revision': revision} : {}),
      ...(filter ? {'filter': filter} : {}),
      ...(orderBy ? {'order-by': orderBy} : {})
    };
    return this.http.get(url, {params: qParams}).pipe(map(res => {
      return res && res['ActionSummaries'] ? res['ActionSummaries'] : [];
    }), catchError(() => {
      return of([] as ActionSummary[]);
    }));
  }

  getLinkedItems(caseObject?: string, ID?: number, allRPNeeded?: boolean) {
    const url = `${environment.rootURL}mc${environment.version}/cases/linked-items`;
    const qParams = {
      'case-id': ID.toString(),
      'case-type': caseObject,
      ...(allRPNeeded === false ? {'all-release-packages-needed': 'false'} : {})
    };
    return this.http.get(url, {params: qParams}).pipe(
      map(response => {
        return response as Categories;
      }), catchError((err) => {
        return of({} as Categories);
      }));
  }

  getOverlayLinkedItems(id: number, path: string, sort?) {
    const qParam = {
      'view': 'linked-items',
      ...(sort ? {'sort': sort} : {})
    };
    const url = `${environment.rootURL}${path}/${id}`;
    return this.http.get(url, {params: qParam}).pipe(
      map(response => {
        return response as Categories;
      }), catchError((err) => {
        return of({} as Categories);
      }));
  }

  getCaseObjectLinkedItemsCount(caseObjectRootURL: string, caseObjectId: string): Observable<CaseObjectLinkedItemsCount> {
    caseObjectRootURL = caseObjectRootURL.toUpperCase().startsWith('CHANGEREQUEST') ? 'change-requests' :
      caseObjectRootURL.toUpperCase().startsWith('CHANGENOTICE') ? 'change-notices' :
        caseObjectRootURL.toUpperCase().startsWith('RELEASEPACKAGE') ? 'release-packages' : caseObjectRootURL;

    const url = `${environment.rootURL}mc${environment.version}/${caseObjectRootURL}/${caseObjectId}/collaboration-objects`;
    return this.http.get(url).pipe(map(res => {
      return res && res['CollaborationObjectsCountElement'] ? res['CollaborationObjectsCountElement'] : {};
    }), catchError(err => {
      return of({} as CaseObjectLinkedItemsCount);
    }));
  }
}
