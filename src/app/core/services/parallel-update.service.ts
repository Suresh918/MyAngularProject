import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelpersService } from '../utilities/helpers.service';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  'providedIn': 'root'
})

export class ParallelUpdateService {
  rootServiceUrl: string;

  constructor(private readonly http: HttpClient,
              private readonly helpersService: HelpersService) {
    this.rootServiceUrl = `${environment.rootURL}mc${environment.version}`;
  }

  getDeltaList(payload) {
    return this.http.post(`${this.rootServiceUrl}/audits/determine-delta`, payload).pipe(map(res => {
      return (res && res['Determinedelta'] ? res['Determinedelta'] : {});
    }));
  }

  getCaseObjectData(objectType, id) {
    const url = `${this.rootServiceUrl}/${objectType}/${id}`;
    return this.http.get(url).pipe(map(res => {
      return res;
    }));
  }

  getDiffMergeList(payload) {
    return this.http.post(`${this.rootServiceUrl}/audits/diff-merge`, payload).pipe(map(res => {
      return (res && res['DiffMergeElement'] ? res['DiffMergeElement'] : {});
    }));
  }
}
