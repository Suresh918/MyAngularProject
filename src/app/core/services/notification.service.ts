import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, delay, map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

import {environment} from '../../../environments/environment';
import {
  Announcement,
  SubscriptionStatus,
  Categories,
  NotificationSummary
} from '../../shared/models/mc-presentation.model';
import {NotificationAnalytics} from '../../shared/components/case-object-list/case-object-list.model';

@Injectable({
  'providedIn': 'root'
})

export class NotificationService {
  rootServiceUrl: string;
  url: string;

  constructor(private readonly http: HttpClient) {
    this.rootServiceUrl = `${environment.rootURL}mc${environment.version}/notifications`;
  }

  getUserNotifications$(orderBy?: string, filterObj?: any, isRead?: boolean): Observable<any[]> {
    const url = `${environment.rootURL}mc${environment.version}/announcements/view/user`;
    const qParams = {
      ...(filterObj ? filterObj : {}),
      ...(orderBy ? {'order-by': '' + orderBy} : {}),
      ...(typeof isRead === 'boolean' ? {'isRead': Number(isRead)} : {}),
      'isActive': 1
    };
    return this.http.get(url, {params: qParams}).pipe(map(res => {
        return (res && res['announcements'] ? res['announcements'] : []) as Announcement[];
      }), catchError(() => {
        return of([] as Announcement[]);
      })
    );
  }

  getHeaderNotifications(fetchDetails: string): Observable<Categories> {
    const qParams = {
      'number-of-items': '24',
      'start-position': '0',
      'is-details-required': fetchDetails
    };
    return this.http.get(this.rootServiceUrl + '/view/categorized-user-notification-summaries', {params: qParams}).pipe(
      map(response => {
        return response as Categories;
      }), catchError(() => {
        return of({} as Categories);
      }));
  }

  getSubscriptionStatusOfCaseObject(caseId: string, caseType: string): Observable<SubscriptionStatus> {
    const url = `${this.rootServiceUrl}/subscription`;
    const qParams = {
      'case-id': caseId,
      'case-type': caseType
    };
    return this.http.get(url, {params: qParams}).pipe(map(res => {
        return res as SubscriptionStatus;
      }), catchError(() => {
        return of({} as SubscriptionStatus);
      })
    );
  }

  setSubscriptionStatusOfCaseObject(action: string, caseId: string, caseType: string): Observable<SubscriptionStatus> {
    const url = `${this.rootServiceUrl}/subscription?case-action=${action}&case-id=${caseId}&case-type=${caseType}`;
    return this.http.put(url, {}).pipe(map(res => {
        return res as SubscriptionStatus;
      }), catchError(() => {
        return of({} as SubscriptionStatus);
      })
    );
  }

  getNotificationSubscriptionStatus(caseId: string, caseType: string): Observable<any> {
    const url = `${environment.rootURL}notification-service/notifications/subscription`;
    const qParams = {
      'case-id': caseId,
      'case-type': caseType.toUpperCase()
    };
    return this.http.get(url, {params: qParams}).pipe(map(res => {
        return res ? res : {};
      }), catchError(() => {
        return of({});
      })
    );
  }

  subscribeToNotification(caseId: string, caseType: string): Observable<any> {
    const url = `${environment.rootURL}notification-service/notifications/subscribe`;
    const payload = {
      'case_id': caseId,
      'case_type': caseType.toUpperCase()
    };
    return this.http.post(url, payload).pipe(map(res => {
        return res ? res : {};
      }), catchError(() => {
        return of(null);
      })
    );
  }

  unsubscribeToNotification(caseId: string, caseType: string): Observable<any> {
    const url = `${environment.rootURL}notification-service/notifications/unsubscribe`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        'case_id': caseId,
        'case_type': caseType.toUpperCase()
      },
    };
    return this.http.delete(url, options).pipe(map(res => {
        return res ? res : {};
      }), catchError(() => {
        return of(null);
      })
    );
  }

  getNotificationsOverview(view: string, filterParameters, startPosition?: number, noOfItems?: number): Observable<NotificationSummary> {
    const qParams = {
      'view': view,
      'start-position': startPosition,
      'number-of-items': noOfItems,
      ...filterParameters
    };
    return this.http.get(this.rootServiceUrl + '/view/summaries', {params: qParams}).pipe(delay(500))
       .pipe(map(response => {
         return response as NotificationSummary;
       }), catchError(() => {
         return of({} as NotificationSummary);
    }));
  }

  getNotificationPanelCounts(view: string, filterParameters?): Observable<NotificationAnalytics[]> {
    const qParams = {
      'view': view,
      ...(filterParameters.linkedChangeObject ? {'linkedChangeObject': '' + filterParameters.linkedChangeObject} : {}),
      ...(filterParameters.createdOnBegin ? {'createdOnBegin': '' + filterParameters.createdOnBegin} : {}),
      ...(filterParameters.createdOnFinish ? {'createdOnFinish': '' + filterParameters.createdOnFinish} : {}),
      ...(filterParameters.userIDs ? {'userIDs': '' + filterParameters.userIDs} : {})
    };
    return this.http.get(this.rootServiceUrl + '/view/count-by-type', {params: qParams}).pipe(
      map(response => {
        return (response && response['NotificationCountOverviewElement'] ? response['NotificationCountOverviewElement'] : []) as NotificationAnalytics[];
      }), catchError(() => {
        return of({} as NotificationAnalytics[]);
      }));
  }

  toggleSingleNotificationStatus(view, caseAction , id) {
    const qParams = {
      'id': id,
      'case-action': caseAction,
      'view': view
    };
    const url = `${this.rootServiceUrl}`;
    return this.http.put(url, {}, {params: qParams}).pipe(map(res => {
      return res;
      }), catchError(() => {
        return of({} as SubscriptionStatus);
      })
    );
  }

  toggleMultipleNotificationsStatus(view, caseAction , filterParameters) {
    const qParams = {
      'case-action': caseAction,
      'view': view,
      ...(filterParameters.linkedChangeObject ? {'linkedChangeObject': '' + filterParameters.linkedChangeObject} : {}),
      ...(filterParameters.createdOnBegin ? {'createdOnBegin': '' + filterParameters.createdOnBegin} : {}),
      ...(filterParameters.createdOnFinish ? {'createdOnFinish': '' + filterParameters.createdOnFinish} : {}),
      ...(filterParameters.userIDs ? {'userIDs': '' + filterParameters.userIDs} : {}),
      ...(filterParameters.type ? {'type': '' + filterParameters.type} : {})
    };
    const url = `${this.rootServiceUrl}`;
    return this.http.put(url, {}, {params: qParams}).pipe(map(res => {
        return res;
      }), catchError(() => {
        return of({} as SubscriptionStatus);
      })
    );
  }

}
