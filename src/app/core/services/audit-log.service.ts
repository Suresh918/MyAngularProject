import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {environment} from '../../../environments/environment';
import {HelpersService} from '../utilities/helpers.service';
import {ReviewAuditLogService} from './review-audit-log.service';
import {ChangeRequestAuditLogService} from './change-request-audit-log.service';
import {ReleasePackageAuditLogService} from './release-package-audit-log.service';
import {CaseObjectServicePath} from '../../shared/components/case-object-list/case-object.enum';


@Injectable({providedIn: 'root'})
export class AuditLogService {
  auditBaseURL: string;
  caseObjectRouterPath: string;
  constructor(private readonly http: HttpClient,
              private readonly helpersService: HelpersService,
              private readonly changeRequestAuditLogService: ChangeRequestAuditLogService,
              private readonly releasePackageAuditLogService: ReleasePackageAuditLogService,
              private readonly reviewAuditLogService: ReviewAuditLogService) {
    this.auditBaseURL = `${environment.rootURL}mc${environment.version}/audits`;
  }

  getAudit(filterObj?: any, isMyTeamHistory?: boolean): any {
    filterObj = this.helpersService.removeEmptyKeysFromObject(filterObj);
    if (filterObj['case-type'].toUpperCase() === 'REVIEW') {
      return this.reviewAuditLogService.getReviewAuditLog(filterObj);
    } else if (filterObj['case-type'].toUpperCase() === 'CHANGEREQUEST') {
      return this.changeRequestAuditLogService.getChangeRequestAuditLog(filterObj);
    } else if (filterObj['case-type'].toUpperCase() === 'RELEASEPACKAGE') {
      return this.releasePackageAuditLogService.getReleasePackageAuditLog(filterObj);
    } else if (isMyTeamHistory) {
      const url = this.auditBaseURL + '/myteam-history';
      return this.http.get(url, {params: filterObj});
    } else {
      return this.http.get(this.auditBaseURL, {params: filterObj});
    }
  }

  getCaseObjectHistory(caseObjectId: string, caseObjectType: string): Observable<any> {
    const qParams = {
      'case-id': caseObjectId,
      'case-type': caseObjectType
    };
    const url = this.auditBaseURL + '/history';
    return this.http.get(url, {params: qParams});
  }

  /*getMyTeamHistory(caseObjectId: string, caseObjectType: string, startPosition: string, numberOfItems: string): Observable<any> {
    const qParams = {
      'case-id': caseObjectId,
      'case-type': caseObjectType,
      'start-position': startPosition,
      'number-of-items': numberOfItems,
    };
    const url = this.auditBaseURL + '/myteam-history';
    return this.http.get(url, {params: qParams});
  }*/

  getMyTeamHistory(caseObjectId: string, caseObjectType: string): Observable<any> {
    if (caseObjectType === 'ChangeNotice') {
      const qParams = {
        'case-id': caseObjectId,
        'case-type': caseObjectType
      };
      const url = this.auditBaseURL + '/myteam-history';
      return this.http.get(url, {params: qParams});
    } else {
      const qParams = {
        'view': 'aggregate',
        'include-deleted': true + ''
      };

      this.caseObjectRouterPath = CaseObjectServicePath[caseObjectType];
      const url = `${environment.rootURL}${this.caseObjectRouterPath}/my-team/${caseObjectId}/change-log`;
      return this.http.get(url, {params: qParams});
    }
  }

  getReviewHistory(caseObjectId: string, property: string): Observable<any> {
    const qParams = {
      ...(property ? { 'property': property } : {}),
    };
    const url = `${environment.rootURL}review-service/reviews/${caseObjectId}/change-log`;
    return this.http.get(url, {params: qParams});
  }
}
