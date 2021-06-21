import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()

export class CreatorLinkedChangeRequestDialogService {
  constructor(private readonly http: HttpClient) {
  }

  linkedChangeRequests$(changeRequestID: string, excludeChangeRequestWithId: string, page, size): Observable<any> {
    const qParams = {
      'view': 'summary',
      'page': page,
      'size': size,
      'view-criteria': `change_request_number:"*${changeRequestID}*" and change_owner_type:"CREATOR"` + excludeChangeRequestWithId,
    };
    const url = `${environment.rootURL}change-request-service/change-requests`;
    return this.http.get(url, { params: qParams }).pipe(map(res => {
      return (res ? res : {});
    }), catchError(() => {
      return of({});
    }));
  }
}
