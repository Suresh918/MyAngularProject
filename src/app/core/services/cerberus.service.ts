import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import {DIA, DIABOM, DIABOMRevision, DIARevision} from '../../shared/models/cerberus.model';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  'providedIn': 'root'
})

export class CerberusService {
  private readonly rootServiceUrl;

  constructor(private readonly http: HttpClient) {
    this.rootServiceUrl = `${environment.rootURL}cerberus${environment.version}/dia-boms`;
  }

  getChangeRequestDIABOM(changeRequestID: string): Observable<DIABOM> {
    return this.getDIABOM(new HttpParams().set('change-request-id', changeRequestID));
  }

  getChangeNoticeDIABOM(changeNoticeID: string): Observable<DIABOM> {
    return this.getDIABOM(new HttpParams().set('change-notice-id', changeNoticeID));
  }

  getDIABOM(httpParams: HttpParams): Observable<DIABOM> {
    return this.http.get(this.rootServiceUrl, { params: httpParams }).pipe(
      map((res: DIABOM) => {
          if (res) {
            const diabomWorkingRevision: DIABOMRevision = {
              ID: res.id,
              revision: 'Working',
              lastModifiedBy: res.lastModifiedBy,
              lastModifiedOn: res.lastModifiedOn
            };
            (res.revisions && res.revisions.length > 0) ? res.revisions.unshift(diabomWorkingRevision) : res.revisions = [diabomWorkingRevision];
            return res;
          }
        }
      ),
      catchError(() => {
        return of({} as DIABOM);
      }));
  }

  getDIABOMDetails(id: string, path: string): Observable<DIA> {
    return this.http.get(`${environment.rootURL}${path}/${id}/dia-bom`).pipe(
      map((res: DIA) => {
        const diabomWorkingRevision: DIARevision = {
          id: res.id,
          revision: 'Working',
          changeRequestID: res.changeRequestID ? res.changeRequestID : null,
          changeNoticeID: res.changeNoticeID ? res.changeNoticeID : null,
          last_modified_by: res.last_modified_by,
          last_modified_on: res.last_modified_on
        };
        res.revisions ? res.revisions.unshift(diabomWorkingRevision) : res.revisions = [diabomWorkingRevision];
          return res;
        }),
      catchError((err) => {
        return of({} as DIA);
      }));
  }
}
