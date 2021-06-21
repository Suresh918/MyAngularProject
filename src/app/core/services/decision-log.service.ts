import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HelpersService } from '../../core/utilities/helpers.service';
import { Observable } from 'rxjs/Rx';
import { DecisionLogSummary } from '../../shared/models/mc-presentation.model';
import { of } from 'rxjs';

@Injectable({
  'providedIn': 'root'
})
export class DecisionLogService {
  rootServiceUrl: string;

  constructor(private readonly http: HttpClient,
              private readonly helpersService: HelpersService) {
    this.rootServiceUrl = `${environment.rootURL}mc${environment.version}/agenda-items`;
  }

  getDecisionLogList(startPosition: number, numberOfItems: number, filter?: string): Observable<DecisionLogSummary> {
    const url = `${this.rootServiceUrl}/view/decision-logs`;
    const qParams = {
      'start-position': ' ' + startPosition,
      'number-of-items': ' ' + numberOfItems,
      ...(filter ? { 'filter': ' ' + filter } : {})
    };
    return this.http.get(url, { params: qParams }).pipe(
      map(response => {
        return {
          totalItems: response ? response['totalItems'] : 0,
          decisionLogList: response ? response['decisionLogs'] : []
        } as DecisionLogSummary;
      }), catchError((err) => {
        return of({} as DecisionLogSummary);
      }));
    /*const response = {
      'DecisionLogElement': [
        {
          'decision': 'Some string',
          'minutes': 'Some other string',
          'conclusion': 'Yet another string',
          'motivation': 'Guess what, another string',
          'actualMeetingDate': '2018-12-27T17: 30: 00+01: 00', //this could be empty if the user did not fill it in during mom
          'communicatedOnDate': '2018-12-27T17: 30: 00+01: 00',
          'linkElements': [
            {
              'ID': '123',
              'type': 'AgendaItem'
            },
            {
              'ID': '3093',
              'revision': 'AA',
              'type': 'ChangeRequest'
            }
          ],
          'attendeesPresent': [
            {
              'userID': 'anikumar',
              'fullName': 'Anil Kumar',
              'email': 'anil.kumar-akvd@example.qas',
              'abbreviation': 'AKVD',
              'departmentName': 'IT O&I Application Services Support'
            },
            {
              'userID': 'mabdirim',
              'fullName': 'Mansur Abdirimov',
              'email': 'mansur.abdirimov@example.qas',
              'abbreviation': 'MABK',
              'departmentName': 'IT CCC EAI, WF, QPI'
            },
            {
              'userID': 'musulluc',
              'fullName': 'Cem Musullugil',
              'email': 'cem.musullugil@example.qas',
              'abbreviation': 'CMUS',
              'departmentName': 'IT CCC EAI, WF, QPI'
            },
            {
              'userID': 'ealtin',
              'fullName': 'Eda Altin',
              'email': 'eda.altin@example.qas',
              'abbreviation': 'EALU',
              'departmentName': 'MI DE PLM Configuration Management'
            },
            {
              'userID': 'bmuppa',
              'fullName': 'Bharath Muppa',
              'email': 'bharath.muppa@example.qas',
              'abbreviation': 'BMUP',
              'departmentName': 'IT O&I Appl. Services Mobile Apps'
            }
          ]
        }
      ],
      'totalItems': 1
    };
     return Observable.of({
      totalItems: response ? response['totalItems'] : 0,
       decisionLogList: response ? response['DecisionLogElement'] : []
    } as DecisionLogSummary);*/
  }
}


