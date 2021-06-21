import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Permission} from '../../shared/models/mc.model';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserPermissionService {
  rootServiceUrl: string;

  constructor(private readonly http: HttpClient) {
    this.rootServiceUrl = `${environment.rootURL}mc${environment.version}`;
  }

  getPermissionListByCaseObject$(caseObjectID: string, caseObjectType: string, view: string): Observable<Permission[]> {
    const url = this.rootServiceUrl + '/permissions';
    const qParams = { 'case-id': caseObjectID, 'case-type': caseObjectType, 'view': (view ? view : 'FULL') };
    return this.http.get(url, { params: qParams }).pipe(map(res => {
      return (res && res['permissions'] ? res['permissions'] : []) as Permission[];
    })
    );
  }

  getMyTeamMembersByCaseObject$(caseObjectID: string, caseObjectPath: string): Observable<Permission[]> {
    const url = `${environment.rootURL}${caseObjectPath}/${caseObjectID}/my-team/my-team-members`;
    return this.http.get(url).pipe(map(res => {
        return (res ? res : []) as Permission[];
      })
    );
  }

  savePermissions$(caseObjectID: string, caseObjectType: string, permissionList: Permission[]): Observable<Permission[]> {
    const url = this.rootServiceUrl + '/permissions';
    const qParams = { 'case-id': caseObjectID, 'case-type': caseObjectType, 'case-revision': 'AA' };
    const payload = {
      'permissions': permissionList
    };
    return this.http.post(url, payload, { params: qParams }).pipe(map(res => {
      return (res && res['permissions'] ? res['permissions'] : {}) as Permission[];
    }));
  }

}
