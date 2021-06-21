import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ProjectManager } from '../../shared/models/project-manager.model';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  'providedIn': 'root'
})
export class ProjectManagerService {
  private readonly url: string;

  constructor(private readonly http: HttpClient) {
    this.url = `${environment.rootURL}mc${environment.version}`;
  }

  getProjectManager$(caseObjectId: number, type: string): Observable<ProjectManager> {
    const qParams = {
      'case-type': type
    };
    return this.http.get(`${this.url}/cases/project-leads?case-id=${caseObjectId}`,  {params: qParams}).pipe(
      map(res => res as ProjectManager),
      catchError((err) => of(err))
    );
  }
}
