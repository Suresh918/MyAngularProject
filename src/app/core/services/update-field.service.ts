import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {UpdateFieldRequest, UpdateFieldResponse, UpdateInstanceRequest} from '../../shared/models/field-element.model';
import {HttpClient} from '@angular/common/http';
import {HelpersService} from '../utilities/helpers.service';
import {CaseObject, ChangeRequest, ReleasePackage, ReviewEntry} from '../../shared/models/mc.model';
import {CaseObjectServicePath} from '../../shared/components/case-object-list/case-object.enum';

@Injectable({
  providedIn: 'root'
})
export class UpdateFieldService {

  rootServiceUrl: string;
  azureDevUrl = 'https://projectname-tst.azure.example.com/api/';
  azureUrl: string;
  changeRequestUrl: string;
  releasePackageUrl: string;
  constructor(private readonly http: HttpClient,
              private readonly helpersService: HelpersService) {
    this.rootServiceUrl = `${environment.rootURL}mc${environment.version}`;
    this.azureUrl = `${environment.rootURL}review-service`;
    this.changeRequestUrl = `${environment.rootURL}change-request-service/change-requests/`;
    this.releasePackageUrl = `${environment.rootURL}release-package-service/release-packages/`;
  }

  updateField$(caseObject: CaseObject, updateFieldRequest: UpdateFieldRequest, sourceSystemID?: string): Observable<UpdateFieldResponse> {
    const url = `${this.rootServiceUrl}/fields`;
    const qParams = {
      'case-id': caseObject.ID,
      'case-type': caseObject.type,
      ...(caseObject.revision ? {'case-revision': caseObject.revision} : {}),
      'case-action': 'Save'
    };

    if (sourceSystemID) {
      qParams['source-system-id'] = sourceSystemID;
    }
    return this.http.put(url, updateFieldRequest, {params: qParams}).pipe(map(res => {
      return (res ? res : {}) as UpdateFieldResponse;
    }), catchError((err) => {
      return of(err);
    }));
  }

  updateInstance$(caseObject: CaseObject, instanceId: string, instancePath: string, updateInstanceRequest: UpdateInstanceRequest): Observable<UpdateFieldResponse> {
    const caseObjectPath =
      `${CaseObjectServicePath[caseObject.type + 'InstanceUpdate']}`
      + (instancePath ? ('/' + instancePath) : '');
    const url = `${environment.rootURL}${caseObjectPath}/${instanceId || caseObject.ID}`;
    return this.http.patch(url, updateInstanceRequest).pipe(map(res => {
      return (res ? res : {}) ;
    }), catchError((err) => {
      return of(err);
    }));
  }


  updateStatusField$(caseObjectID: any, caseObjectPath: any, action: string): Observable<UpdateFieldResponse> {
    const qParams = {'action': action, 'revision': 'AA'};
    const url = `${this.rootServiceUrl}/${caseObjectPath}/${caseObjectID}`;
    return this.http.put(url, '', {params: qParams}).pipe(map(res => {
      return (res ? res : {}) as any;
    }), catchError((err) => {
      return of(this.helpersService.getErrorMessage(err));
    }));
  }

  updateCaseObjectStatusField(id, action?: string, caseObjectPath?: string): Observable<any> {
    const qParams = {'case-action': action};
    const url = `${environment.rootURL}${caseObjectPath}/${id}`;
    return this.http.patch(url, null, {params: qParams}).pipe(map(res => {
      return (res ? res : {});
    }));
  }

  getChangeRequestDetails$(id: number): Observable<ChangeRequest> {
    const qParams = {'view': 'change-request-detail'};
    const url = `${this.changeRequestUrl}${id}`;
    return this.http.get(url, {params: qParams}).pipe(map(res => {
      return (res ? res : {}) as ChangeRequest;
    }));
  }

  getReleasePackageDetails(id: string): Observable<any> {
    return this.http.get(this.releasePackageUrl + id).pipe(map(response => {
      return response ? response : {};
    }), catchError(err => of({})));
  }
}
