import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

import {environment} from '../../../../../environments/environment';
import {Tag} from '../../../../shared/models/mc-presentation.model';

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  rootServiceUrl: string;

  constructor(private readonly httpClient: HttpClient) {
    this.rootServiceUrl = `${environment.rootURL}configuration-service/tags`;
  }

  getTags(): Observable<Tag[]> {
  // const qParams = {'serviceName': serviceName};
    const url = `${this.rootServiceUrl}`;
    return this.httpClient.get(this.rootServiceUrl, {headers: { 'ngsw-bypass': 'true' }}).pipe(map(response => {
      return (response ? response : []) as Tag[];
    }));
  }

  addTag(label): Observable<Tag[]> {
    const payload = {
        label: label
    };
    return this.httpClient.post(this.rootServiceUrl, payload).pipe(map(response => {
      return (response ? response : []) as Tag[];
    }));
  }

  updateTag(tagObject?, label?): Observable<Tag[]> {
    const payload = {
        'label': label || tagObject.label,
        'name': tagObject.name,
        'active': !!tagObject.active
        /*...(tagObject.active ? {'active': tagObject.active} : {'status': 'INACTIVE'})*/
    };
    return this.httpClient.put(`${this.rootServiceUrl}/${tagObject.name}`, payload).pipe(map(response => {
      return (response ? response['tags'] : []) as Tag[];
    }));
  }

}
