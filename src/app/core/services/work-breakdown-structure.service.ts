import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable, of} from 'rxjs';
import {WorkBreakdownStructure} from '../../shared/models/work-breakdown-structure.model';
import {catchError, map} from 'rxjs/operators';
import {CaseObject} from '../../shared/models/mc.model';
import {HelpersService} from '../utilities/helpers.service';
import {Project} from '../../shared/models/project.model';
import {CaseObjectServicePath} from '../../shared/components/case-object-list/case-object.enum';
import {ProjectManager} from '../../shared/models/project-manager.model';

@Injectable({
  'providedIn': 'root'
})
export class WorkBreakdownStructureService {
  private readonly hanaRootServiceURL: string;

  constructor(private readonly http: HttpClient,
              private readonly helpersService: HelpersService) {
    this.hanaRootServiceURL = `${environment.rootURL}hana-cache${environment.version}/work-breakdown-structures`;
  }

  getWorkBreakdownStructures$(searchCriteria: string): Observable<WorkBreakdownStructure[]> {
    const qParams = {
      'search-criteria': searchCriteria
    };
    return this.http.get(this.hanaRootServiceURL, {params: qParams}).pipe(
      map((res) => res['wbs'] as WorkBreakdownStructure[]),
      catchError(() => of([]))
    );
  }

  getWorkBreakdownStructureFromCaseObject(caseObjectId: number, type: string): Observable<WorkBreakdownStructure[]> {
    const qParams = {
      'case-type': type
    };
    return this.http.get(`${environment.rootURL}mc${environment.version}/cases/wbs-project-details?case-id=${caseObjectId}`, {params: qParams}).pipe(
      map((res) => res ? res['wbs'] as WorkBreakdownStructure[] : [] as WorkBreakdownStructure[])
    );
  }

  getWorkBreakdownStructure$(element): Observable<WorkBreakdownStructure> {
    return this.http.get(`${this.hanaRootServiceURL}/${element}`).pipe(
      map((res) => res ? res['wbs'] as WorkBreakdownStructure : {} as WorkBreakdownStructure)
    );
  }

  saveWBS(projectID: string, caseObject: CaseObject) {
    const caseObjectPath = this.helpersService.getCaseObjectForms(caseObject.type).path;
    const url = `${environment.rootURL}mc${environment.version}/${caseObjectPath}/${caseObject.ID}/project`;
    const qParams = {
      'revision': caseObject.revision || '',
      'case-action': 'save',
      'project-id': projectID
    };
    return this.http.put(url, null, {params: qParams}).pipe(
      map((res) => res),
      catchError(() => of(''))
    );
  }

  /*********************************************                 MIRAI SERVICES           **************************************************/

  getProjectDetails(caseObjectId: number, caseObjectType: string): Observable<Project> {
    return this.http.get(`${environment.rootURL}` + CaseObjectServicePath[caseObjectType] + `/${caseObjectId}/project`).pipe(
      map(res => (res) ? res as Project : {} as Project)
    );
  }

  getProjectsOnSearch(searchKey: string, caseObjectType: string): Observable<Project[]> {
    const qParams = {
      q: searchKey
    };
    return this.http.get(`${environment.rootURL}` + `hana-service/wbs`, {params: qParams}).pipe(
      map((res) => res as Project[]),
      catchError(() => of([]))
    );
  }

  getProjectLead(caseObjectId: number, caseObjectType: string): Observable<ProjectManager> {
    return this.http.get(`${environment.rootURL}` + CaseObjectServicePath[caseObjectType] + `/${caseObjectId}/project-lead`).pipe(
      map(res => res ? res : {}),
      catchError((err) => of(err))
    );
  }
}


