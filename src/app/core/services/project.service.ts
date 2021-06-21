import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Project} from '../../shared/models/project.model';
import {CaseObjectServicePath} from '../../shared/components/case-object-list/case-object.enum';

@Injectable({
  'providedIn': 'root'
})
export class ProjectService {
  private readonly hanaRootServiceURL: string;

  constructor(private readonly http: HttpClient) {
    this.hanaRootServiceURL = `${environment.rootURL}hana-cache${environment.version}/projects`;
  }

  getProjects$(searchCriteria: string): Observable<Project[]> {
    const qParams = {
      'search-criteria': searchCriteria
    };
    return this.http.get(this.hanaRootServiceURL, { params: qParams }).pipe(
      map(res => res['projects'] as Project[]),
      catchError(() => of([]))
    );
  }

  getProject$(caseObjectId: number, type: string): Observable<Project> {
    const qParams = {
      'case-type': type
    };
    return this.http.get(`${environment.rootURL}mc${environment.version}/cases/project-details?case-id=${caseObjectId}`,  {params: qParams} ).pipe(
      map(res => (res && res['project']) ? res['project'] as Project : {} as Project)
    );
  }

  getProjectDetails$(caseObjectId: number, path: string): Observable<Project> {
    return this.http.get(`${environment.rootURL}${path}/${caseObjectId}/project-details`).pipe(
      map(res => (res && res['project']) ? res['project'] as Project : {} as Project)
    );
  }

  /*********************************************                 MIRAI SERVICES           **************************************************/

  getProductDetails(caseObjectId: number, caseObjectType: string): Observable<Project> {
    return this.http.get(`${environment.rootURL}` + CaseObjectServicePath[caseObjectType] + `/${caseObjectId}/product`).pipe(
      map(res => (res) ? res as Project : {} as Project)
    );
  }

  getProductsOnSearch(searchKey: string, caseObjectType: string): Observable<Project[]> {
    const qParams = {
      q: searchKey
    };
    return this.http.get(`${environment.rootURL}` + `hana-service/projects`, {params: qParams}).pipe(
      map((res) => res as Project[]),
      catchError(() => of([]))
    );
  }
}
