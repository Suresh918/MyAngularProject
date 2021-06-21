import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Categories} from '../../shared/models/mc-presentation.model';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskSchedulerService {
  rootServiceUrl: string;

  constructor(private readonly http: HttpClient) {
    this.rootServiceUrl = `${environment.rootURL}mc${environment.version}/notifications`;
  }

  getBackgroundMyTeamTasks(fetchOnlyCounts?: boolean): Observable<Categories> {
    let url = `${environment.rootURL}mc${environment.version}/permissions/bulk-permissions/categorized-background-task-summaries`;
    url = fetchOnlyCounts ? url + '?is-details-required=false' : url ;
    return this.http.get(url).pipe(map(res => {
        return (res ? res : {}) as Categories;
      }), catchError(() => {
        return of({} as unknown as Categories);
      })
    );
  }

  getBackgroundAgendaTasks(fetchOnlyCounts?: boolean): Observable<Categories> {
    let url = `${environment.rootURL}mc${environment.version}/agendas/view/background-tasks`;
    url = fetchOnlyCounts ? url + '?is-details-required=false' : url ;
    return this.http.get(url).pipe(map(res => {
        return (res ? res : {}) as Categories;
      }), catchError(() => {
        return of({} as unknown as Categories);
      })
    );
  }

  getBackgroundRPTasks(fetchOnlyCounts?: boolean) {
    const url = `${environment.rootURL}release-package-service/release-packages/jobs`;
    const qParam = {'view': fetchOnlyCounts ? 'categorized-count' : 'categorized'};
    return this.http.get(url, {params: qParam}).pipe(map(res => {
        return (res ? res : {}) as Categories;
      }), catchError(() => {
        return of({} as unknown as Categories);
      })
    );
  }

  getBackgroundCRTasks(fetchOnlyCounts?: boolean) {
    const url = `${environment.rootURL}change-request-service/change-requests/jobs`;
    const qParam = {'view': fetchOnlyCounts ? 'categorized-count' : 'categorized'};
    return this.http.get(url, {params: qParam}).pipe(map(res => {
        return (res ? res : {}) as Categories;
      }), catchError(() => {
        return of({} as unknown as Categories);
      })
    );
  }

  retryDeleteAgendaTasks(id: string, caseAction: string): Observable<Categories> {
    const qParams = {
      'task-id': id,
      'case-action': caseAction
    };
    const url = `${environment.rootURL}mc${environment.version}/agendas/view/background-tasks`;
    return this.http.put(url, null, {params: qParams}).pipe(map(res => {
        return (res ? res : null) as Categories;
      }), catchError(() => {
        return of(null as unknown as Categories);
      })
    );
  }

  retryDeleteBulkPermissionTasks(id: string): Observable<Categories> {
    const url = `${environment.rootURL}mc${environment.version}/permissions/bulk-permissions/${id}`;
    return this.http.put(url, null).pipe(map(res => {
        return (res ? res : null) as Categories;
      }), catchError(() => {
        return of(null as unknown as Categories);
      })
    );
  }


}



