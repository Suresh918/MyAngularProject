import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HelpersService } from '../utilities/helpers.service';
import { UserAuthorizationService } from './user-authorization.service';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { Note, NoteElement, Review, ReviewEntry } from '../../shared/models/mc.model';
import { catchError, map } from 'rxjs/operators';
import { ReviewEntrySummaryList } from '../../shared/models/mc-presentation.model';


@Injectable({
  'providedIn': 'root'
})
export class ReviewEntryService {
  rootServiceUrl: string;
  azureDevUrl = 'https://projectname-tst.azure.example.com/api/';
  azureUrl: string;

  constructor(private readonly http: HttpClient,
              private readonly helpersService: HelpersService) {
    this.rootServiceUrl = `${environment.rootURL}mc${environment.version}/review-entries`;
    this.azureUrl = `${environment.rootURL}review-service`;
  }

  getReviewEntry$(id: string): Observable<ReviewEntry> {
    const url = `${this.rootServiceUrl}/${id}`;
    return this.http.get(url).pipe(map(res => {
      return (res && res['ReviewEntryElement'] ? res['ReviewEntryElement'] : {}) as ReviewEntry;
    }));
  }

  saveNotesToReviewEntry$(id: string, notes: Note[]): Observable<NoteElement> {
    const payload = {
      'NoteElement': notes
    };
    const url = `${this.rootServiceUrl}/${id}/notes`;
    const qParams = {
      'case-action': 'Save'
    };
    return this.http.put(url, payload, { params: qParams }).pipe(map(res => {
      return (res && res['NoteElement'] ? res['NoteElement'] : {}) as NoteElement;
    }), catchError(() => {
      return of({} as NoteElement);
    }));
  }

  ReviewEntrySummaryList(id: number, startPosition: number, numberOfItems: number, filter?: string, orderBy?: string): Observable<ReviewEntrySummaryList> {
    const url = `${this.rootServiceUrl}/view/linked-review-entries`;
    const qParams = {
      'link-id': id + '',
      'link-type': 'review',
      'start-position': '' + startPosition,
      'number-of-items': '' + numberOfItems,
      ...(filter ? { 'filter': '' + filter } : {}),
      ...(orderBy ? { 'order-by': '' + orderBy } : {})
    };
    return this.http.get(url, { params: qParams }).pipe(
      map(response => {
        return {
          totalItems: response ? response['totalItems'] : 0,
          reviewEntrySummaries: response ? response['ReviewEntrySummaryElement'] : []
        } as ReviewEntrySummaryList;
      }), catchError(() => {
        return of({} as ReviewEntrySummaryList);
      }));
  }
  updateReviewEntryStatusOrRemark$(Id: string, caseAction: string, remark: string): Observable<ReviewEntry> {
    const qParams = new HttpParams().set('action', caseAction);
    const url = `${this.rootServiceUrl}/${Id}`;
    const payload = {
      'ReviewEntryElement': { 'ID': Id, 'executorRemark': remark },
    };
    return this.http.put(url, payload, { params: qParams }).pipe(
      map(response => {
        return (response && response['ReviewEntryElement'] ? response['ReviewEntryElement'] : {}) as ReviewEntry;
      })
    );
  }

  updateReviewEntry$(formData): Observable<ReviewEntry> {
    formData = this.helpersService.removeEmptyKeysFromObject(formData);
    const payload = {
      'ReviewEntryElement': formData
    };
    const url = `${this.rootServiceUrl}/${formData.ID}`;
    const qParams = {
      'action': 'save',
    };
    return this.http.put(url, payload, { params: qParams }).pipe(map(res => {
      return (res && res['ReviewEntryElement'] ? res['ReviewEntryElement'] : {}) as ReviewEntry;
    }));
  }

  addReviewEntry$(reviewId: string, reviewEntries: ReviewEntry[]): Observable<ReviewEntry> {
    let payload = {
      'LinkElement': { 'ID': reviewId, 'type': 'Review' },
      'ReviewEntries': reviewEntries
    };
    payload = this.helpersService.removeEmptyKeysFromObject(payload);
    return this.http.post(this.rootServiceUrl, payload).pipe(map(res => {
      return (res && res['ReviewEntryElement'] ? res['ReviewEntryElement'] : {}) as ReviewEntry;
    }));
  }

  deleteReviewEntry(id: string): Observable<{}> {
    const url = `${this.rootServiceUrl}/${id}`;
    return this.http.delete(url);
  }

  updateReviewEntry(id, caseAction): Observable<any> {
    const qParam = {'case-action': 'caseAction'};
    return this.http.patch(`${this.azureUrl}/review-entries/${id}`, null, {params: qParam}).pipe(map(res => {
      return res ? res : {};
    }));
  }

}
