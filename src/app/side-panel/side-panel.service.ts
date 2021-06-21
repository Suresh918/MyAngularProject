import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HelpersService} from '../core/utilities/helpers.service';
import {environment} from '../../environments/environment';
import {CaseObjectServicePath} from '../shared/components/case-object-list/case-object.enum';
import {catchError, map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

@Injectable()
export class SidePanelService {
  rootServiceUrl: string;

  constructor(private readonly http: HttpClient, private readonly helpersService: HelpersService) {
    this.rootServiceUrl = `${environment.rootURL}`;
  }

  getDocuments(caseObjectID: string, caseObject: string): Observable<any> {
    const qParam = {
      'view': 'overview',
      'criteria': 'tags#other or tags#OTHER'
    };
    const url = `${this.rootServiceUrl}` + CaseObjectServicePath[caseObject] + `/${caseObjectID}/documents`;
    return this.http.get(url, {params: qParam}).pipe(
      map((res) => {
          return (res ? res : {});
        }
      ));
  }

  uploadDocument(filePayload: FormData, caseObjectID: string, caseObject: string): Observable<any> {
    const url = `${this.rootServiceUrl}` + CaseObjectServicePath[caseObject] + `/${caseObjectID}/documents`;
    return this.http.post(url, filePayload).pipe(
      map((res) => res ? res : {}),
      catchError(() => {
        return of({});
      })
    );
  }

  updateDocument(filePayload: any, documentID: string, caseObject: string) {
    const url = `${this.rootServiceUrl}` + CaseObjectServicePath[caseObject] + `/documents/${documentID}`;
    return this.http.patch(url, filePayload).pipe(
      map((res) => res ? res : {}),
      catchError(() => {
        return of({});
      })
    );
  }

  removeDocument(documentID: number, caseObject: string) {
    const url = `${this.rootServiceUrl}` + CaseObjectServicePath[caseObject] + `/documents/${documentID}`;
    return this.http.delete(url, {observe: 'response'});
  }

  getDocumentContent$(docID: string, caseObject: string) {
    return this.http.get(`${this.rootServiceUrl}` + CaseObjectServicePath[caseObject] + `/documents/${docID}/content`, {responseType: 'blob' as 'json'}).pipe(map(res => {
      return (res ? res : null);
    }));
  }

  getCommentDocumentContent$(docID: string, caseObject: string) {
    return this.http.get(`${this.rootServiceUrl}` + CaseObjectServicePath[caseObject] + `/comments/documents/${docID}/content`, {responseType: 'blob' as 'json'}).pipe(map(res => {
      return (res ? res : null);
    }));
  }

  uploadCommentDocument(filePayload: FormData, commentID: string, caseObject: string) {
    const url = `${this.rootServiceUrl}` + CaseObjectServicePath[caseObject] + `/comments/${commentID}/documents`;
    return this.http.post(url, filePayload).pipe(
      map((res) => res ? res : {}),
      catchError(() => {
        return of({});
      })
    );
  }

  updateCommentDocument(noteElement: any, documentID: string, caseObject: string) {
    const payload = {
      'oldIns': {
        'description': noteElement.documents[0].description
      },
      'newIns': {
        'description': noteElement.note
      }
    };
    const url = `${this.rootServiceUrl}` + CaseObjectServicePath[caseObject] + `/comments/documents/${documentID}`;
    return this.http.patch(url, payload).pipe(
      map((res) => res ? res : {}),
      catchError(() => {
        return of({});
      })
    );
  }

  removeCommentDocument(documentID: string, caseObject: string) {
    const url = `${this.rootServiceUrl}` + CaseObjectServicePath[caseObject] + `/comments/documents/${documentID}`;
    return this.http.delete(url, {observe: 'response'});
  }

  getAllAttachments(caseObjectID: string, caseObject: string): Observable<any> {
    const url = (caseObject === 'ChangeRequest' || caseObject === 'ReleasePackage')  ?
      `${this.rootServiceUrl}` + CaseObjectServicePath[caseObject] + `/${caseObjectID}/documents` :
      `${this.rootServiceUrl}` + CaseObjectServicePath[caseObject] + `/${caseObjectID}/documents-all`;
    const qParam = (caseObject === 'ChangeRequest' || caseObject === 'ReleasePackage') ? {'view': 'categorized', 'tags': 'all'} : {};
    return this.http.get(url, {params: qParam}).pipe(
      map((res) => {
        return (res ? res : []);
      }),
      catchError((err) => {
        return of([]);
      })
    );
  }

  getComments(caseObjectID: string, caseObject: string): Observable<any> {
    const qParams = {
      'view': 'overview',
      'page': '0',
      'size': '200',
      'sort': 'created_on,desc'
    };
    const url = `${this.rootServiceUrl}` + CaseObjectServicePath[caseObject] + `/${caseObjectID}/comments`;
    return this.http.get(url, {params: qParams}).pipe(
      map((res) => {
        return (res ? res : {});
      }),
      catchError((err) => {
        return of({});
      })
    );
  }

  createComment(commentString: string, caseObjectID: string, caseObject: string) {
    const payload = {'comment_text': commentString};
    const url = `${this.rootServiceUrl}` + CaseObjectServicePath[caseObject] + `/${caseObjectID}/comments`;
    return this.http.post(url, payload).pipe(
      map((res) => res ? res : {}),
      catchError(() => {
        return of({});
      })
    );
  }

  publishComment(commentString: string, commentID: string, caseObject: string) {
    const qParam = {'case-action' : 'PUBLISH'};
    const payload = {'comment_text': commentString};
    const url = `${this.rootServiceUrl}` + CaseObjectServicePath[caseObject] + `/comments/${commentID}`;
    return this.http.patch(url, payload, {params: qParam}).pipe(
      map((res) => res ? res : {}),
      catchError(() => {
        return of({});
      })
    );
  }

  updateComment(commentString: any, commentID: string, caseObject: string) {
    const payload = {
      'comment_text': commentString
    };
    const url = `${this.rootServiceUrl}` + CaseObjectServicePath[caseObject] + `/comments/${commentID}`;
    return this.http.put(url, payload).pipe(
      map((res) => res ? res : {}),
      catchError(() => {
        return of({});
      })
    );
  }

  removeComment(commentString: string, commentID: string, caseObject: string) {
    const qParam = {'case-action' : 'REMOVE'};
    const payload = {'comment_text': commentString};
    const url = `${this.rootServiceUrl}` + CaseObjectServicePath[caseObject] + `/comments/${commentID}`;
    return this.http.patch(url, payload, {params: qParam}).pipe(
      map((res) => res ? res : {}),
      catchError(() => {
        return of({});
      })
    );
  }

  deleteComment(commentID: string, caseObject: string) {
    const url = `${this.rootServiceUrl}` + CaseObjectServicePath[caseObject] + `/comments/${commentID}`;
    return this.http.delete(url, {observe: 'response'});
  }

  getCBCommentsByCRID(crID: string): Observable<any> {
    const qParams = {
      'link-id': crID,
      'link-type': 'ChangeRequest'
    };
    const url = `${environment.rootURL}mc${environment.version}/agenda-items/view/cb-notes`;
    return this.http.get(url, {params: qParams}).pipe(
      map((res) => {
        return (res ? res : {});
      }),
      catchError((err) => {
        return of({});
      })
    );
  }

  getCRCommentsByAgendaItemID(id: string) {
    const url = `${this.rootServiceUrl}change-request-service/change-requests/comments`;
    const qParams = {
      'agenda-item-id': id,
      'view': 'overview'
    };
    return this.http.get(url, {params: qParams}).pipe(
      map((res) => {
        return (res ? res : {});
      }),
      catchError((err) => {
        return of({});
      })
    );
  }

  getCRAttachmentsByAgendaItemID(id: string): Observable<any> {
    const url = `${this.rootServiceUrl}change-request-service/change-requests/documents`;
    const qParams = {
      'view': 'categorized',
      'tags': 'all',
      'agenda-item-id': id
    };
    return this.http.get(url, {params: qParams}).pipe(
      map((res) => {
        return (res ? res : []);
      }),
      catchError((err) => {
        return of([]);
      })
    );
  }
}
