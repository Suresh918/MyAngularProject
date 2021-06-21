import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { CategorizedNoteSummary, NoteElement } from '../../shared/models/mc.model';

@Injectable({
  'providedIn': 'root'
})

export class NotesService {
  rootUrl: string;

  constructor(private readonly http: HttpClient) {
    this.rootUrl = `${environment.rootURL}mc${environment.version}`;
  }

  getNotes(caseObject: string, ID: string) {
    const url = `${this.rootUrl}/${caseObject}/${ID}/notes`;
    let qParams = {};
    if (caseObject.toLowerCase().indexOf('releasepackage') === -1 && caseObject !== 'agenda-items') {
      qParams = {
        'revision': 'AA'
      };
    }
    return this.http.get(url, { params: qParams }).pipe(map((res: CategorizedNoteSummary) => {
      return res ? res : of({} as CategorizedNoteSummary);
    }));
  }

  saveNote(caseObject: string, ID: string, note?: NoteElement, caseAction?: string): Observable<NoteElement> {
    const url = `${this.rootUrl}/${caseObject}/${ID}/notes`;
    let qParams = {};
    const payload = {
      'NoteElement': [note]
    };
    if (caseObject.toLowerCase().indexOf('releasepackage') === -1 && caseObject !== 'agenda-items') {
      qParams = {
        'revision': 'AA',
        'case-action': caseAction
      };
    }
    if (caseObject === 'agenda-items') {
      qParams = {
        'case-action': caseAction
      };
    }
    return this.http.put(url, payload, { params: qParams }).pipe(map(res => {
      return (res && res['NoteElement'] ? res['NoteElement'] : {}) as NoteElement;
    }));
  }

  createNote(caseObject: string, ID: string) {
    const url = `${this.rootUrl}/${caseObject}/${ID}/notes`;
    let qParams = {};
    const payload = {
      'NoteElement': null
    };
    if (caseObject.toLowerCase().indexOf('releasepackage') === -1 && caseObject !== 'agenda-items') {
      qParams = {
        'revision': 'AA'
      };
    }
    return this.http.post(url, payload, { params: qParams }).pipe(map(res => {
      return (res && res['NoteElement'] ? res['NoteElement'] : {}) as NoteElement;
    }));
  }

  deleteNote(caseObjectType?: string, caseObjectID?: string, noteID?: string): Observable<{}> {
    const url = `${this.rootUrl}/${caseObjectType}/${caseObjectID}/notes?note-id=${noteID}`;
    let qParams = {};
    if (caseObjectType !== 'agenda-items') {
      qParams = {
        'revision': 'AA'
      };
    }
    return this.http.delete(url, { params: qParams });
  }
}
