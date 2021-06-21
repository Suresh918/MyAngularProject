import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {forkJoin, Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ChangeRequest, ReviewItem} from '../../shared/models/mc.model';
import {Problem} from '../../shared/models/air.model';
import {LinkObject} from '../../shared/models/mc-presentation.model';
import {ErrorResponse} from '../../shared/models/mc-store.model';
import {ProductBreakdownStructure} from '../../shared/models/product-breakdown-structure.model';

@Injectable({
  providedIn: 'root'
})
export class AirPbsService {
  rootServiceUrl: string;

  constructor(private readonly http: HttpClient) {
    this.rootServiceUrl = `${environment.rootURL}change-request-service/change-requests`;
  }

  unlinkAIRIssue$(airIssueId: string, changeRequestId: string): Observable<Problem> {
    const qParam = {'case-action': 'unlink-air'};
    const linkedObject = {
      'LinkElement':
        {
          'ID': airIssueId,
          'type': 'AIR'
        }
    } as LinkObject;
    const url = `${environment.rootURL}mc${environment.version}/change-requests/${changeRequestId}`;
    return this.http.put(url, linkedObject, {params: qParam})
      .pipe(
        map(res => ({}) as Problem),
        catchError(err => of({'number': airIssueId, 'errorInServiceCall': this.getErrorMessage(err)} as Problem))
      );
  }

  unlinkAIR$(airID: string, changeRequestID: string): Observable<any> {
    const qParam = {'case-action': 'unlink-air'};
    const payload = {
      'id': airID,
      'type': 'AIR'
    };
    const url = `${this.rootServiceUrl}/${changeRequestID}`;
    return this.http.patch(url, payload, {params: qParam}).pipe(
      map(res => (res && res['contexts'] ? res['contexts'] : {})),
      catchError(() => {
        return of([]);
      })
    );
  }

  getErrorMessage(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      return 'An error occurred:' + error.error.message;
    } else if (error.error && (error.error as ErrorResponse).Detail && (error.error as ErrorResponse).Detail.Message) {
      // The backend returned an unsuccessful response code.
      const txId = (error.error as ErrorResponse).TransactionID;
      return 'An error occurred:' + (error.error as ErrorResponse).Detail.Message.replace('@TxId@',
        (error.error as ErrorResponse).TransactionID);
    } else {
      return 'An unhandled error occurred: Some static message';
    }
  }

  unlinkPBS$(pbsID: string, changeRequestID: string): Observable<any> {
    const qParam = {'case-action': 'unlink-pbs'};
    const payload = {
      'id': pbsID,
      'type': 'PBS'
    };
    const url = `${this.rootServiceUrl}/${changeRequestID}`;
    return this.http.patch(url, payload, {params: qParam}).pipe(
      map(res => (res && res['contexts'] ? res['contexts'] : {})),
      catchError(() => {
        return of([]);
      })
    );
  }
}
