import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  'providedIn': 'root'
})
export class UserAuthorizationService {
  private readonly url: string;

  constructor(private readonly http: HttpClient) {
    this.url = `${environment.rootURL}mc${environment.version}/cases/case-actions`;
  }

  getAuthorizedCaseActions(id: string, revision: string, secure: number, type: string) {
    let qParams = {};
    if (type === 'action') {
      qParams = {'id': id, 'secure': secure, 'type': type};
    } else {
      qParams = {'id': id, 'revision': revision, 'secure': secure, 'type': type};
    }
    return this.http.get(this.url, {params: qParams});
  }

  getAuthorizedCaseActionsForIdList(idList: string[], type: string) {

    const qParams = {
      'ids': idList.join(','),
      'type': type,
      ...(type === 'releasepackage' ? {'revision': 'AA'} : {})
    };
    return this.http.get(this.url, {params: qParams});
  }

  getAuthorizedCaseActionsForId(id: string, type: string, linkedObjectType?: string) {
    const qParams = {
        'id': id,
        'type': type,
        ...(linkedObjectType ? { 'linked-object-type': linkedObjectType } : {})
      };
    return this.http.get(this.url, {params: qParams});
  }

  getCasePermissionsById(id: number, servicePath: string) {
    return this.http.get(`${environment.rootURL}${servicePath}/${id}/case-permissions`);
  }

  getCaseActions(type: string) {
    const qParams = {'type': type};
    return this.http.get(this.url, {params: qParams});
  }

}


