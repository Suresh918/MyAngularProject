import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TeamCenterService {
  teamCenterRootServiceUrl: string;

  constructor(private readonly httpClient: HttpClient) {
    this.teamCenterRootServiceUrl = `${environment.rootURL}teamcenter${environment.version}`;
  }

  getDelta1ObjectId(sourceSystemID: string): any {
    const url = `${this.teamCenterRootServiceUrl}/engineering-change-notices/${sourceSystemID}/delta-report`;
    return this.httpClient.get(url).pipe(map(res => {
      return res;
    }));
  }
}
