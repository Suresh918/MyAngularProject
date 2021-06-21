import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {HelpersService} from '../utilities/helpers.service';
import {Action} from '../../shared/models/mc.model';
import {ActionHelpersService} from '../utilities/action-helpers.service';
import {
  ActionCountSummary,
  ActionCountSummaryList,
  ActionSummary,
  ActionSummaryList, Categories
} from '../../shared/models/mc-presentation.model';

@Injectable()
export class ActionListService {

  actionsUrl: string;

  constructor(private readonly http: HttpClient, private readonly helpersService: HelpersService,
              private readonly actionHelpersService: ActionHelpersService) {
    this.actionsUrl = `${environment.rootURL}mc${environment.version}/actions`;
  }

  getActionSummaryList$(startPosition, numberOfItems, filter?: string, orderBy?: string, startDateTime?: Date, endDateTime?: Date): Observable<ActionSummaryList> {
    const qParams = this.getQueryParams(startPosition, numberOfItems, filter, orderBy, startDateTime, endDateTime);
    return this.http.get(this.actionsUrl + '/view/summary', { params: qParams })
      .pipe(
        map(response => {
          const actionSummaryList: ActionSummaryList = {
            totalItems: response['totalItems'],
            actionSummary: response['actionSummary']
          };
          actionSummaryList.actionSummary.forEach((actionSummary: ActionSummary) => {
            actionSummary.actionMetadata = this.actionHelpersService.getActionMetadata(actionSummary.actionElement);
          });
          return actionSummaryList;
        }),
        catchError(() => {
          const actionSummaryList: ActionSummaryList = {
            totalItems: 0,
            actionSummary: []
          };
          return of(actionSummaryList);
        })
      );
  }

getUserActions() {
  const qParams = {
    'number-of-items': '24',
    'start-position': '0'
  }
  return this.http.get(this.actionsUrl + '/view/categorized-user-actions-summaries', {params: qParams}).pipe(
    map(response => {
      return response as Categories;
    }), catchError((err) => {
      return of({} as Categories);
    }));
}
  updateActionStatus(action: Action, id: string, caseAction: string) {
    const qParams = new HttpParams().set('case-action', caseAction);
    const url = `${this.actionsUrl}/${id}`;
    return this.http.put(url, action, { params: qParams }).pipe(
      map(response => {
        return (response && response['ActionElement'] ? response['ActionElement'] : {}) as Action;
      })
    );
  }

  updateAction(value, action): Observable<Action> {
    value = this.helpersService.removeEmptyKeysFromObject(value);
    const qParams = new HttpParams().set('case-action', action);
    return this.http.put(`${this.actionsUrl}/${value.ID}`, '', {params: qParams}).pipe(map(res => {
      return (res && res['ActionElement'] ? res['ActionElement'] : {}) as Action;
    }));
  }

  getActionCountSummary$(startPosition, numberOfItems, filter?: string, orderBy?: string, startDateTime?: Date, endDateTime?: Date): Observable<ActionCountSummaryList> {
    const qParams = this.getQueryParams(startPosition, numberOfItems, filter, orderBy);
    return this.http.get(this.actionsUrl + '/view/count-summary', { params: qParams })
      .pipe(
        map(response => {
          return {
            totalItems: response['TotalItems'],
            actionCountSummaries: response['ActionsCountSummary']
          } as ActionCountSummaryList;
        }),
        catchError(() => {
          return of({
            totalItems: 0,
            actionCountSummaries: [] as ActionCountSummary[]
          } as ActionCountSummaryList);
        })
      );
  }

  getQueryParams(startPosition, numberOfItems, filter?: string, orderBy?: string, startDateTime?: Date, endDateTime?: Date) {
    return {
      'start-position': startPosition,
      'number-of-items': numberOfItems,
      ...(filter ? { 'filter': filter } : {}),
      ...(orderBy ? { 'order-by': orderBy } : {}),
      ...(startDateTime ? { 'startDateTime': orderBy } : {}),
      ...(endDateTime ? { 'endDateTime': orderBy } : {})
    };
  }

  getActionsOverviewList(startPosition, numberOfItems, filter?: string, orderBy?: string): Observable<ActionSummaryList> {
    const queryObj = {
      'start-position': startPosition,
      'number-of-items': numberOfItems,
      ...(filter ? {'filter': filter} : {}),
      ...(orderBy ? {'order-by': orderBy} : {})
    };

    return this.http.get(this.actionsUrl + '/view/overview', {params: queryObj})
      .pipe(
        map(response => {
          return {
            totalItems: response['totalItems'],
            actionSummary: response['actionOverview']
          } as ActionSummaryList;
        }),
        catchError(() => {
          return of({
            totalItems: 0,
            actionSummary: []
          } as ActionSummaryList);
        })
      );
  }
}
