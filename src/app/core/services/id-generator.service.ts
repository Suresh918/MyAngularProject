import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  'providedIn': 'root'
})
export class IDGeneratorService {

  constructor(private readonly http: HttpClient) {
  }

  generateId(service: string) {
    const url = `${environment.rootURL}id-generator${environment.version}/id`;
    const qParams = new HttpParams().set('service', service);
    return this.http.get(url, { params: qParams });
  }

}
