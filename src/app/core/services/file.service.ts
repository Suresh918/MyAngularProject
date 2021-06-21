import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  'providedIn': 'root'
})
export class FileService {
  filesUrl: string;
  azureDevUrl = 'https://projectname-tst.azure.example.com/api/';
  azureUrl: string;
  constructor(private readonly http: HttpClient) {
    this.filesUrl = `${environment.rootURL}mc${environment.version}/documents`;
    this.azureUrl = `${environment.rootURL}review-service`;
  }

  uploadFile(filePayload: FormData) {
    return this.http.post(this.filesUrl, filePayload).pipe(
      map((res) => res),
      catchError(() => {
        return of(null);
      })
    );
  }

  uploadReviewFile(id: string, filePayload: FormData) {
    return this.http.post(`${this.azureUrl}/comments/${id}/documents`, filePayload).pipe(
      map((res) => res),
      catchError(() => {
        return of(null);
      })
    );
  }

  updateFile(filePayload: any, ID: string) {
    const url = `${this.filesUrl}/${ID}`;
    return this.http.put(url, filePayload).pipe(
      map((res) => res),
      catchError(() => {
        return of(null);
      })
    );
  }

  removeFile(id: number) {
    const url = `${environment.rootURL}mc${environment.version}/documents/${id}`;
    return this.http.delete(`${url}`);
  }
  removeReviewDocument(id: number) {
    const url = `${this.azureUrl}/documents/${id}/case-action/REMOVE`;
    return this.http.patch(`${url}`, {});
  }
}
