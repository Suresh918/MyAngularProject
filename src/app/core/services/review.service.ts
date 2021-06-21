import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs/Rx';
import {of} from 'rxjs';

import {environment} from '../../../environments/environment';
import {HelpersService} from '../../core/utilities/helpers.service';
import {ReleasePackage, Review} from '../../shared/models/mc.model';
import {InitiateReview} from '../../reviews/shared/initiate-review-dialog/initiate-review-dialog';
import {
  ECNReviewSummaryList,
  ReviewSummary,
  ReviewSummaryList,
  ReviewSummaryListNew
} from '../../shared/models/mc-presentation.model';

@Injectable({
  'providedIn': 'root'
})
export class ReviewService {
  rootServiceUrl: string;
  actionsUrl: string;
  azureDevUrl = 'https://projectname-tst.azure.example.com/api/';
  azureUrl: string;
  rpUrl: string;
  constructor(private readonly http: HttpClient,
              private readonly helpersService: HelpersService) {
    this.rootServiceUrl = `${environment.rootURL}mc${environment.version}/reviews`;
    this.actionsUrl = `${environment.rootURL}mc${environment.version}/actions`;
    this.rpUrl = `${environment.rootURL}mc${environment.version}/release-packages`;
    this.azureUrl = `${environment.rootURL}review-service`;
  }
  getReviewersActionDetails$(id: number): Observable<any> {
    const qParam = {'view': 'summary'};
    const url = `${this.azureUrl}/reviews/${id}/review-tasks`;
    return this.http.get(url, {params: qParam}).pipe(map(res => {
      return res ? res : {};
    }));
  }

  getReviewEntries(id: number, startPosition?: number, numberOfItems?: number, getCaseActions?: boolean, filter?: string, orderBy?: string, viewType?: string): Observable<any> {
    const qParams = {
      'view': 'overview',
      ...((viewType) ? (filter ? {'view-criteria': filter} : {}) : (filter ? {'criteria': filter} : {})),
      ...(getCaseActions ? {'get-case-actions': getCaseActions + ''} : {}),
      ...(startPosition || startPosition === 0 ? {'page': startPosition + ''} : ''),
      ...(numberOfItems || numberOfItems === 0 ? {'size': numberOfItems + ''} : ''),
    ...(true ? {'slice-select': 'results'} : '')
    };
    const url = `${this.azureUrl}/reviews/${id}/review-entries?` + orderBy;
    return this.http.get(url, {params: qParams}).pipe(map(res => {
      return res ? res : [];
    }));
  }

  getReviewEntriesCount$(id: number, filter?: string): Observable<any> {
    const qParams = {
      'view': 'overview',
      ...(filter ? {'criteria': filter} : {}),
      'slice-select': 'TOTAL-RESULTS'
    };
    const url = `${this.azureUrl}/reviews/${id}/review-entries`;
    return this.http.get(url, {params: qParams}).pipe(map(res => {
      return res ? res : [];
    }));
  }

  getReviewLinkedReleasePackage$(id: number): Observable<ReleasePackage> {
    const url = `${environment.rootURL}mc${environment.version}/release-packages`;
    const qParams = {
      'link-type': 'review',
      'link-id': `${id}`
    };
    return this.http.get(url + '/view/linked-summary', {params: qParams}).pipe(map(res => {
      return (res && res['ReleasePackageSummaryElement'] && res['ReleasePackageSummaryElement'][0] ? res['ReleasePackageSummaryElement'][0] : {});
    }));
  }

  getLinkedReview$(id: string, linkType: string): Observable<ECNReviewSummaryList> {
    const url = `${this.azureUrl}/reviews`;
    const qParams = {
      'view': 'summary',
      'criteria': `(contexts.context_id:${id} and contexts.type:${linkType.toUpperCase()})`
    };
    return this.http.get(url, {params: qParams}).pipe(map(res => {
      return res as ECNReviewSummaryList;
    }));
  }

  ReviewSummaryList(startPosition: number, numberOfItems: number, filter?: string, orderBy?: string, viewDQLfilter?: string): Observable<ReviewSummaryListNew> {
    const url = `${this.azureUrl}/reviews`;
    const qParams = {
      'view': 'overview',
      ...(filter ? {'criteria': filter} : {}),
      ...(viewDQLfilter ? {'view-criteria': viewDQLfilter} : {}),
      'sort': orderBy,
      'page': JSON.stringify(startPosition),
      'size': JSON.stringify(numberOfItems),
      'slice-select': 'results'
    };
    return this.http.get(url, {params: qParams}).pipe(
      map(response => {
        return response as ReviewSummaryListNew;
      }), catchError(() => {
        return of({} as ReviewSummaryListNew);
      }));
  }


  reviewSummaryListCount$(filter?: string, viewDQLfilter?: string): Observable<any> {
    const url = `${this.azureUrl}/reviews`;
    const qParams = {
      'view': 'overview',
      ...(filter ? {'criteria': filter} : {}),
      ...(viewDQLfilter ? {'view-criteria': viewDQLfilter} : {}),
      'slice-select': 'TOTAL-RESULTS'
    };
    return this.http.get(url, {params: qParams}).pipe(
      map(response => {
        return (response ? response : null);
      }));
  }

  initiateReview$(payLoad: any): Observable<Review> {
    return this.http.post(`${this.azureUrl}/reviews/aggregate`, payLoad).pipe(map(res => {
      return (res ? res : null);

    }));
  }

  getReviewPanelCounts$(filterString?: string, viewDQLfilter?: string) {
    const url = `${this.azureUrl}/reviews`;
    const qParams = {
      'view': 'status-overview',
      ...(filterString ? {'criteria': filterString} : {}),
      ...(viewDQLfilter ? {'view-criteria': viewDQLfilter} : {})
    };
    return this.http.get(url, {params: qParams}).pipe(map(res => {
      return (res ? res['status_counts'] : null);
    }));
  }

  getReviewDetailsPanelCounts$(reviewId: number, filterString?: string) {
    const url = `${this.azureUrl}/reviews/review-entries`;
    const qParams = {
      'view': 'status-overview',
      ...({'criteria': (reviewId ? ('review.id:' + reviewId) : '') + (filterString ? ` and (${filterString})` : '')})
    };
    return this.http.get(url, {params: qParams}).pipe(map(res => {
      return (res ? res['status_counts'] : null);
    }));
  }

  getReviewById$(reviewId: number) {
    return this.http.get(`${this.azureUrl}/reviews/${reviewId}`).pipe(map(res => {
      return (res ? res : null);
    }));
  }

  getAuthorizedCaseActionsForId(id: string) {
    const url = `${this.azureUrl}/reviews/${id}/case-permissions`;
    return this.http.get(url).pipe(
      map(response => {
        return response ? response : {};
      }));
  }

  getRootReviewComments(reviewEntryId: number) {
    const qParam = {'view': 'overview'};
    return this.http.get(`${this.azureUrl}/review-entries/${reviewEntryId}/comments`, {params: qParam}).pipe(map(res => {
      return (res ? res : null);
    }));
  }

  createEmptyReply$(commentId: number, commentString: string) {
    const payLoad = {
      ...(commentString ? {'comment_text': commentString} : {})
    };
    return this.http.post(`${this.azureUrl}/comments/${commentId}/comments`, payLoad).pipe(map(res => {
      return (res ? res : null);
    }));
  }

  createDraftComment$(reviewEntryId: number, commentString: string) {
    const payLoad = {
      ...(commentString ? {'comment_text': commentString} : {})
    };
    return this.http.post(`${this.azureUrl}/review-entries/${reviewEntryId}/comments`, payLoad).pipe(map(res => {
      return (res ? res : null);
    }));
  }

  publishComment$(commentId: number, commentString: string) {
    const qParam = {'case-action': 'PUBLISH'};
    const payLoad = {
      ...(commentString ? {'comment_text': commentString} : {})
    };
    return this.http.patch(`${this.azureUrl}/review-entries/comments/${commentId}`, payLoad, {params: qParam}).pipe(map(res => {
      return (res ? res : null);
    }));
  }

  updateComment$(commentId: number, commentString: string) {
    const payLoad = {
      ...(commentString ? {'comment_text': commentString} : {})
    };
    return this.http.put(`${this.azureUrl}/review-entries/comments/${commentId}`, payLoad).pipe(map(res => {
      return (res ? res : null);
    }));
  }

  replyComment$(commentId: number, commentString: string) {
    const payLoad = {
      ...(commentString ? {'comment_text': commentString} : {})
    };
    return this.http.post(`${this.azureUrl}/comments/${commentId}/comments`, payLoad).pipe(map(res => {
      return (res ? res : null);
    }));
  }

  getCommentsByCommentId$(commentId: number) {
    const qParams = {
      'view': 'overview',
      'sort': 'created_on,desc',
      'page': '0',
      'size': '20'
    };
    return this.http.get(`${this.azureUrl}/comments/${commentId}/comments`, {params: qParams}).pipe(map(res => {
      return (res ? res : null);
    }));
  }

  removeComment$(commentID: number) {
    const qParam = {'case-action': 'REMOVE'};
    return this.http.patch(`${this.azureUrl}/review-entries/comments/${commentID}`, {}, {params: qParam}).pipe(map(res => {
      return (res ? res : null);
    }));
  }

  deleteComment$(commentID: number) {
    return this.http.delete(`${this.azureUrl}/review-entries/comments/${commentID}`).pipe(map(res => {
      return (res ? res : null);
    }));
  }

  getDocumentContent$(documentID: number) {
    return this.http.get(`${this.azureUrl}/comments/documents/${documentID}/content`, {responseType: 'blob' as 'json'}).pipe(map(res => {
      return (res ? res : null);
    }));
  }

  updateReview$(reviewId: number, reviewElement: Review, action: string): Observable<Review> {
    const review = this.helpersService.removeEmptyKeysFromObject(reviewElement);
    const payload = {
      'ReviewElement': review
    };
    return this.http.put(`${this.rootServiceUrl}/${reviewId}?action=${action}`, payload).pipe(map(res => {
      return (res && res['ReviewElement'] ? res['ReviewElement'] : null);
    }));
  }

  updateReviewerAction(id: string, action?: string, motivation?: string): Observable<any> {
    let payload: string | object = '';
    if (motivation) {
      payload = {
        'ActionElement': {
          'motivation': motivation
        }
      };
    }
    return this.http.put(`${this.actionsUrl}/${id}?case-action=${action}`, payload).pipe(map(res => {
      return res;
    }));
  }

  addReviewer$(reviewId: number, reviewerList: InitiateReview): Observable<ReviewSummary> {
    const payload = {
      'Reviewers': reviewerList.reviewers,
      'ReviewersDeadline': reviewerList.reviewersDueDate
    };
    return this.http.put(`${this.rootServiceUrl}/${reviewId}?action=add-reviewers`, payload).pipe(map(res => {
      return (res && res['ReviewSummaryElement'] ? res['ReviewSummaryElement'] : null);
    }));
  }

  deleteReviewer$(reviewId: number, reviewerList): Observable<any> {
    const payload = {
      'Reviewers': reviewerList
    };
    return this.http.patch(`${this.rootServiceUrl}/${reviewId}?action=remove-reviewers`, payload).pipe(map(res => {
      return (res ? res : null);
    }));
  }

  getReviewersByReviewID(id, isCaseActionAllowed): Observable<any> {
    const url = `${this.azureUrl}/reviews/${id}/review-tasks`;
    const qParams = {
      'view': 'summary',
      'get-case-actions': isCaseActionAllowed
    };
    return this.http.get(url, {params: qParams}).pipe(
      map(response => {
        return response ? response : {};
      }));
  }

  getAllReviewTaskCaseActions(): Observable<any> {
    const url = `${this.azureUrl}/reviews/review-tasks/case-actions/mandatory-properties`;
    return this.http.get(url).pipe(
      map(response => {
        return response ? response : {};
      }));
  }

  getCommentCaseAction(commentId: number): Observable<any> {
    const url = `${this.azureUrl}/review-entries/comments/${commentId}/case-actions`;
    return this.http.get(url).pipe(
      map(response => {
        return response ? response : {};
      }));
  }

  createReviewer(reviewId, reviewerData): Observable<any> {
    const payload = {
      'assignee': reviewerData.assignee,
      'due_date': reviewerData.due_date
    };
    return this.http.post(`${this.azureUrl}/reviews/${reviewId}/review-tasks`, payload).pipe(map(res => {
      return res ? res : {};
    }));
  }

  updateReviewer(reviewerData): Observable<any> {
    const payload = {
      'assignee': reviewerData.assignee,
      'due_date': reviewerData.due_date
    };
    return this.http.put(`${this.azureUrl}/review-tasks/${reviewerData.id}`, payload).pipe(map(res => {
      return res ? res : {};
    }));
  }

  updateReviewerPerformCaseAction(reviewerData, caseAction): Observable<any> {
    if (caseAction !== 'DELETE') {
      const qParam = {'case-action': caseAction};
      return this.http.patch(`${this.azureUrl}/reviews/review-tasks/${reviewerData.reviewer.id}`, null, {params: qParam}).pipe(map(res => {
        return res ? res : {};
      }));
    } else {
      return this.http.delete(`${this.azureUrl}/reviews/review-tasks/${reviewerData.reviewer.id}`).pipe(map(res => {
        return res;
      }));
    }
  }

  editReviewersBulkDueDate(payload): Observable<any> {
    return this.http.patch(`${this.azureUrl}/reviews/review-tasks`, payload).pipe(map(res => {
      return (res ? res : null);
    }));
  }

  updateReviewEntry(id, caseAction): Observable<any> {
    const qParam = {'case-action': caseAction};
    return this.http.patch(`${this.azureUrl}/reviews/review-entries/${id}`, null, {params: qParam}).pipe(map(res => {
      return res ? res : {};
    }));
  }

  deleteReviewEntry(reviewId: number) {
    return this.http.delete(`${this.azureUrl}/reviews/review-entries/${reviewId}`).pipe(map(res => {
      return (res ? res : null);
    }));
  }

  updateReview(id, caseAction, forceComplete?: boolean): Observable<any> {
    forceComplete = forceComplete || false;
    let url = `${this.azureUrl}/reviews/${id}?case-action=${caseAction}&view=case-status-aggregate`;
    if (forceComplete) {
      url += '&force-complete=' + forceComplete;
    }
    return this.http.patch(url, null).pipe(map(res => {
      return res ? res : {};
    }));
  }

  getAggregatedReviewCaseActions(id) {
    const qParam = {'view': 'aggregate'};
    return this.http.get(`${this.azureUrl}/reviews/${id}/case-status`, {params: qParam}).pipe(map(res => {
      return res ? res : {};
    }));
  }

  getReviewCaseActions(): Observable<any> {
    return this.http.get(`${this.azureUrl}/reviews/case-actions/mandatory-properties`).pipe(map(res => {
      return (res ? res : null);
    }));
  }

  getReviewEntryCaseActions$(): Observable<any> {
    return this.http.get(`${this.azureUrl}/reviews/review-entries/case-actions/mandatory-properties`).pipe(map(res => {
      return (res ? res : null);
    }));
  }

  getRPCounts$(rpId: number): Observable<any> {
    return this.http.get(`${this.rpUrl}/view/sibling-count?release-package-id=${rpId}`).pipe(map(res => {
      return (res ? res : null);
    }));
  }

  getReviewMaterialList(id: number): Observable<any> {
    const url = `${this.azureUrl}/reviews/${id}/material-delta`;
    return this.http.get(url).pipe(
      map(res => {
        return (res) ? res : {};
      }), catchError((err) => {
        return of(err);
      }));
  }

  getReviewTPDList(id: number): Observable<any> {
    const url = `${this.azureUrl}/reviews/${id}/tpds`;
    return this.http.get(url).pipe(
      map(res => {
        return (res) ? res : {};
      }), catchError((err) => {
      return of(err);
    }));
  }

  getReviewBomStructureList(id: number): Observable<any> {
    const url = `${this.azureUrl}/reviews/${id}/bom-structure`;
    return this.http.get(url).pipe(
      map(res => {
        return (res) ? res : {};
      }), catchError((err) => {
        return of(err);
      }));
  }
}
