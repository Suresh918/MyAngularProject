import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { FunctionalCluster } from '../../shared/models/functional-cluster.model';

@Injectable({
  'providedIn': 'root'
})
export class FunctionalClusterService {
  private readonly url: string;

  constructor(private readonly http: HttpClient) {
    this.url = `${environment.rootURL}change-request-service/change-requests/functional-clusters`;
  }

  getFunctionalClusters(cluster): Observable<FunctionalCluster[]> {
    const qParams = { 'search': cluster };
    return this.http.get(this.url, { params: qParams }).pipe(
      map((res) =>  (res ? res : []) as FunctionalCluster[]),
      catchError(() => of([]))
    );
  }
}
