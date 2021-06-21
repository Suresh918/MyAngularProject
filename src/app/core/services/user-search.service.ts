import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  'providedIn': 'root'
})
export class UserSearchService {

  constructor(private readonly http: HttpClient) {
  }

  getUsers$(user: string, groupType?: string, isMiraiUser?: boolean): Observable<Array<any>> {
    if (user && user.length === 0) {
      return of([]);
    }
    const qParams = {
      'q': user ,
      ...(groupType ? { 'group': groupType } : {}),
    };
    const url = `${environment.rootURL}gds-service/users`;
    return this.http.get(`${url}`, {params: qParams}).pipe(
      map((request: any[]) => {
        return request ? ((request && !isMiraiUser) ? this.processMiraiUser(request) : ((request && isMiraiUser) ? request : [])) : [];
      }, catchError(() => {
        return of([]);
      }))
    );
  }

  getUser(user: string) {
    if (user && user.length === 0) {
      return of([]);
    }
    const url = `${environment.rootURL}gds-service/users/${user}`;
    return this.http.get(url).pipe(
      map((request) => {
        return request ? (request['user'] ? request['user'] : {}) : {};
      }),
      catchError(() => {
        return of(null);
      })
    );
  }

  processMiraiUser(res) {
    const userArray = [];
    if (res && res.length > 0) {
      res.forEach(user => {
        userArray.push({
          fullName: user['full_name'],
          userID: user['user_id'],
          abbreviation: user['abbreviation'],
          departmentName: user['department_name'],
          email: user['email']
        });
      });
    }
    return userArray;
  }
}
