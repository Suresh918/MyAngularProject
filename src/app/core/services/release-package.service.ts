import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {CaseObject} from '../../shared/models/mc.model';
import {MyChangeState} from '../../shared/models/mc-store.model';

@Injectable({
  providedIn: 'root'
})
export class ReleasePackageService {
  releasePackageRootServiceUrl: string;
  caseObject: CaseObject;

  constructor(private readonly httpClient: HttpClient,
              private readonly appStore: Store<MyChangeState>) {
    this.releasePackageRootServiceUrl = `${environment.rootURL}release-package-service/release-packages`;
  }

  getPrerequisiteReleasePackages(searchedRPs: string) {
    const qParams = {
      'view': 'search-summary',
      ...(searchedRPs ? {criteria: `status@"1,2,3,4" and release_package_number:*"${searchedRPs}"*`} : {criteria: `status@"1,2,3,4"`})
    };
    // criteria: `status@"1,2,3,4"` + searchedRPs ?  `and release_package_number@"${searchedRPs}"` : '',
    return this.httpClient.get(`${this.releasePackageRootServiceUrl}`, {params: qParams}).pipe(map(response => {
      return response ? response['results'] : [];
    }));
  }
}
