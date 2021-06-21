import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {Problems} from '../../shared/models/mc-presentation.model';
import {Problem} from '../../shared/models/air.model';

@Injectable({providedIn: 'root'})
export class AirSearchService {
  constructor(private readonly http: HttpClient) {
  }

  findAIRByID$(airID: string): Observable<Problem[]> {
    const qParams = {
      'search': 'P'.concat(airID),
    };
    const url = `${environment.rootURL}change-request-service/change-requests/problems`;
    return this.http.get(url, {params: qParams}).pipe(
      map(res => (res ? res : []) as Problem[]),
      catchError(() => {
        return of([] as Problem[]);
      })
    );
  }

  airProblems$(problemID: string): Observable<Problems[]> {
    const qParams = new HttpParams().set('filter', `number{equal}p${problemID}*`);
    const url = `${environment.rootURL}air${environment.version}/problems`;
    return this.http.get(url, {params: qParams}).pipe(
      map(res => (res ? res : []) as Problems[]),
      catchError(() => {
        return of([]);
      })
    );
  }
}
