import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ReviewItem } from '../../shared/models/mc.model';

@Injectable({
  'providedIn': 'root'
})
export class ReviewItemsService {
  teamCenterRootServiceUrl: string;
  azureDevUrl = 'https://projectname-tst.azure.example.com/api/';
  azureUrl: string;

  constructor(private readonly http: HttpClient) {
    this.teamCenterRootServiceUrl = `${environment.rootURL}teamcenter${environment.version}`;
    this.azureUrl = `${environment.rootURL}review-service`;
  }

  getSolutionItems(sourceSystemID: string): Observable<any> {
    const url = `${this.teamCenterRootServiceUrl}/engineering-change-notices/${sourceSystemID}/solution-items`;
    return this.http.get(url).pipe(map(res => {
        return (res ? res['solutionItems'] : []);
      }),
      catchError(() => of([])));
  }

  getSolutionItemsMDG(sourceSystemID: string): Observable<any> {
     const url = `${this.teamCenterRootServiceUrl}/engineering-change-notices/${sourceSystemID}/solution-items-summary`;
    // const url = `${this.teamCenterRootServiceUrl}/engineering-change-notices/BsmBXnMb5kc5xD/solution-items-summary`;
    return this.http.get(url).pipe(map(res => {
        return (res ? res : []);
      }),
      catchError(() => of([])));
  }

  getReviewEntryDetails(id): Observable<any> {
    const url = `${this.azureUrl}/reviews/review-entries/${id}`;
    return this.http.get(url).pipe(map(res => {
        return (res ? res : null);
      }),
      catchError(() => of(null)));
  }

  createReviewEntry(id, payLoad): Observable<any> {
    return this.http.post(`${this.azureUrl}/reviews/${id}/review-entries`, payLoad).pipe(map(res => {
      return (res ? res : null);
    }));
  }

  editReviewEntry(id, payLoad): Observable<any> {
    return this.http.put(`${this.azureUrl}/reviews/review-entries/${id}`, payLoad).pipe(map(res => {
      return (res ? res : null);
    }));
  }

  createReviewEntriesBulk(id, payLoad): Observable<any> {
    return this.http.post(`${this.azureUrl}/reviews/${id}/review-entries?multiple=true`, payLoad).pipe(map(res => {
      return (res ? res : null);
    }));
  }

  getReviewItemsByName$(searchKey: string, sourceSystemID: string): Observable<ReviewItem[]> {
    const url = `${this.teamCenterRootServiceUrl}/engineering-change-notices/${sourceSystemID}/solution-items/find`;
    const qParams = {
      'name': searchKey
    };
    return this.http.get(url, { params: qParams }).pipe(map(res => {
        return (res ? res['item'] : []) as ReviewItem[];
      }),
      catchError(() => of([] as ReviewItem[])));
  }

  getReviewDefectSolutionItems(reviewID: number): Observable<any> {
    const url = `${this.azureUrl}/reviews/${reviewID}/solution-item-summary`;
    return this.http.get(url).pipe(map(res => {
         return (res ? res : []);
      }),
      catchError(() => of([])));
  }
}
