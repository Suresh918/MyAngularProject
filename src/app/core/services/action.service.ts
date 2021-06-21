import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {HelpersService} from '../utilities/helpers.service';
import {ActionSummaryList, AggregatedAction, AggregatedActionList} from '../../shared/models/mc-presentation.model';
import {ActionHelpersService} from '../utilities/action-helpers.service';
import {Action, ActionSummary} from '../../shared/models/mc.model';

@Injectable({
  'providedIn': 'root'
})

export class ActionService {
  actionsUrl: string;

  constructor(private readonly http: HttpClient, private readonly helpersService: HelpersService,
              private readonly actionHelpersService: ActionHelpersService) {
    this.actionsUrl = `${environment.rootURL}mc${environment.version}/actions`;
  }

  updateAction(value, action, from?): Observable<Action> {
    let payload = {};
    value = this.helpersService.removeEmptyKeysFromObject(value);
    const qParams = new HttpParams().set('case-action', action);
    if (action !== 'REJECT' && action !== 'REMOVE' && action !== 'ACCEPT' && action !== 'COMPLETE' && from !== 'action-details') {
      payload = {
        'ActionElement': value
      };
    }
    return this.http.put(`${this.actionsUrl}/${value.ID}`, payload, {params: qParams}).pipe(map(res => {
      return (res && res['ActionElement'] ? res['ActionElement'] : {}) as Action;
    }));
  }

  createAction(linkedItem, value, action: string, actionType: string): Observable<Action> {
    if (linkedItem.type !== 'ChangeRequest' && linkedItem.type !== 'ReleasePackage') {
      delete linkedItem.status;
    }
    value = this.helpersService.removeEmptyKeysFromObject(value);
    let payload;
    if (actionType === 'REVIEW') {
      payload = {
        'ActionElements': value,
        'LinkElement': linkedItem
      };
    } else {
      payload = {
        'ActionElement': value,
        'LinkElement': linkedItem
      };
    }
    const qParams = new HttpParams().set('case-action', action);
    return this.http.post(this.actionsUrl, payload, {params: qParams}).pipe(map(res => {
      return (res && res['ActionElement'] ? res['ActionElement'] : {}) as Action;
    }));
  }

  updateActionType(type, actionID, action): Observable<any> {
    const qParams = {'case-action': action, 'action-type': type.value};
    return this.http.put(`${this.actionsUrl}/${actionID}/type`, '', {params: qParams}).pipe(map(res => {
      return res as any;
    }));
  }

  getActionSummaryListWithoutCaseActions$(startPosition, numberOfItems, filter?: string): Observable<ActionSummaryList> {
    const qParams = this.getQueryParams(startPosition, numberOfItems, filter);
    return this.http.get(this.actionsUrl + '/view/summary', {params: qParams})
      .pipe(
        map(response => {
          return {
            totalItems: response['totalItems'],
            actionSummary: response['actionSummary']
          } as ActionSummaryList;
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

  getLinkedActionsCount(linkedItemObj): Observable<number> {
    const qParams = {
      'number-of-items': '100',
      'start-position': '0',
      'link-id': linkedItemObj.ID || '',
      'link-revision': linkedItemObj.revision || 'AA',
      'link-type': linkedItemObj.type || '',
      'filter': `generalInformation.status in ('DRAFT','OPEN','ACCEPTED')`
    };
    return this.http.get(this.actionsUrl + '/view/linked', {params: qParams}).pipe(
      map(response => {
        const actionList: Action[] = response['ActionElement'];
        return actionList.length || 0;
      }),
      catchError(() => {
        return of(0);
      })
    );
  }

  getLinkedActions(linkedItemObj, filterOptions, orderBy?): Observable<AggregatedActionList> {
    let qParams = {};
    if (linkedItemObj.type === 'AgendaItem') {
      qParams = {
        'link-id': linkedItemObj.ID || '',
        'link-type': linkedItemObj.type || '',
        ...(filterOptions && filterOptions.trim && filterOptions.trim().length > 0 ? {'filter': '' + filterOptions} : {}),
        ...(orderBy ? {'order-by': '' + orderBy} : {})
      };
    } else {
      qParams = {
        'link-id': linkedItemObj.ID || '',
        'link-revision': linkedItemObj.revision || '',
        'link-type': linkedItemObj.type || '',
        ...(filterOptions && filterOptions.trim && filterOptions.trim().length > 0 ? {'filter': '' + filterOptions} : {}),
        ...(orderBy ? {'order-by': '' + orderBy} : {})
      };
    }
    return this.http.get(this.actionsUrl + '/view/categorized', {params: qParams}).pipe(
      map(response => {
        let actionCategoryList: ActionSummary[] = response['CategorizedActionsElement'] || [];
        actionCategoryList = actionCategoryList.map(actionCategory => {
          if (actionCategory['actionSummaries'] && actionCategory['actionSummaries'].length > 0) {
            actionCategory['actionSummaries'] = actionCategory['actionSummaries'].map(action => {
              const aggregatedAction: AggregatedAction = {} as AggregatedAction;
              aggregatedAction.action = action;
              // aggregatedAction.actionMetadata = this.actionHelpersService.getActionMetadata(action);
              return aggregatedAction;
            });
          }
          return actionCategory;
        });
        return {
          openActionsCount: response['OpenActionsCount'],
          allActionsCount: response['AllActionsCount'],
          actionCategoryList
        } as any;
      }),
      catchError(() => {
        return of({
          openActionsCount: 0,
          allActionsCount: 0,
          actionCategoryList: []
        } as any);
      })
    );
  }


  getQueryParams(startPosition, numberOfItems, filter?: string, orderBy?: string, startDateTime?: Date, endDateTime?: Date) {
    return {
      'start-position': startPosition,
      'number-of-items': numberOfItems,
      ...(filter ? {'filter': filter} : {}),
      ...(orderBy ? {'order-by': orderBy} : {}),
      ...(startDateTime ? {'startDateTime': orderBy} : {}),
      ...(endDateTime ? {'endDateTime': orderBy} : {})
    };
  }

  getAttachmentDetails(linkedItemObj, docType?: string) {
    let qParams = {};
    if (linkedItemObj.type !== 'agenda-items') {
      qParams = {
        'revision': linkedItemObj.revision || '',
        ...(docType ? {'document-tag': docType} : {})
      };
    } else {
      qParams = {
        ...(docType ? {'document-tag': docType} : {})
      };
    }

    return this.http.get(`${environment.rootURL}mc${environment.version}/${linkedItemObj.type}/${linkedItemObj.ID}/documents`, {params: qParams}).pipe(map(res => {
      return res ? res['CategorizedAttachmentElement'] : [];
    }));
  }

  deleteAttachment(linkedItemObj, docID) {
    const url = `${environment.rootURL}mc${environment.version}/documents/${docID}`;
    return this.http.delete(`${url}`);
  }
}
