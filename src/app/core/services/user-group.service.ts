import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

@Injectable({
  'providedIn': 'root'
})
export class UserGroupService {

  constructor(private readonly http: HttpClient) {
  }

  getGroups(group: string) {
    const url = `${environment.rootURL}mc${environment.version}/groups`;
    const qParams = {'name': group};
    return this.http.get(url, {params: qParams});
  }

  getGroups$(group: string, groupType: string): Observable<any> {
    if (group && group.length === 0) {
      return of([]);
    }
    const url = `${environment.rootURL}gds-service/groups`;
    const  qParams = {
      'group_id_prefix': groupType === 'CCB' ? 'cug-cm-ccb' : groupType === 'CB' ? 'cug-cm-cb' : 'cug-cm-*cb',
      'q': group
    };
    return this.http.get(url, {params: qParams}).pipe(
      map((response) => {
        return response ? response : [];
      }, catchError(() => {
        return of([]);
      }))
    );
  }

  getGroupUserList(groupId: string) {
    const url1 = `${environment.rootURL}mc${environment.version}/groups/group-members`;
    const qParams = {'groups': groupId};
    return this.http.get(url1, {params: qParams}).pipe(
      map(response => {
          return {
            users: response ? response['groups'][0]['members'] : []
          };
        }
      ));
  }
}
