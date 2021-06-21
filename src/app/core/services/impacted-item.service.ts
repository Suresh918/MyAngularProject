import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HelpersService} from '../utilities/helpers.service';
import {environment} from '../../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {CaseObjectServicePath} from '../../shared/components/case-object-list/case-object.enum';
import {ImpactedItem} from '../../shared/models/mc.model';
import {ImpactedItemResponse, ImpactedItemType} from '../../shared/models/mc-presentation.model';

@Injectable({
  'providedIn': 'root'
})

export class ImpactedItemService {
  miraiURL: string;
  bpmURL: string;

  constructor(private readonly http: HttpClient, private readonly helpersService: HelpersService) {
    this.miraiURL = `${environment.rootURL}impacted-item-service/`;
  }

  getMandatoryProperties(): Observable<any[]> {
    const url = `${this.miraiURL}change-objects/scope-items/case-actions/mandatory-properties`;
    return this.http.get(url).pipe(
      map(res => {
        return (res ? res : []) as any[];
      })
    );
  }

  createItemContainer(id: string, payload): Observable<any> {
    const qParams = {
      'view': 'aggregate'
    };
    const url = `${this.miraiURL}change-objects`;
    return this.http.post(url, payload, {params: qParams}).pipe(
      map(res => {
        return (res ? res : {});
      }),
      catchError(() => {
        return of(null);
      })
    );
  }

  getImpactedItems(id: string, type: string, caseObjectType: string): Observable<ImpactedItem[]> {
    const qParams = {
      'change-object-number': id,
      'change-object-type': caseObjectType.toUpperCase()
    };
    const url = `${this.miraiURL}change-objects/${type}`;
    return this.http.get(url, {params: qParams}).pipe(
      map(res => {
        return (res ? res : []) as ImpactedItem[];
      })
    );
  }

  searchImpactedItemType(searchCriteria: string, itemType: string): Observable<string[]> {
    const qParams = {
      'search': searchCriteria
    };
    const url = `${this.miraiURL}items/${itemType}`;
    return this.http.get(url, {params: qParams}).pipe(
      map((res: ImpactedItemType[]) => {
        const response = [];
        res.forEach(item => {
          if (item && item['id']) {
            response.push(item['id']);
          } else if (item && item['work_instruction_id']) {
            response.push(item['work_instruction_id']);
          }
        });
        return response;
      })
    );
  }

  getImpactedItemDetails(id: string, type: string): Observable<ImpactedItemType> {
    const url = `${this.miraiURL}items/${type}/${id}` ;
    return this.http.get(url).pipe(
      map(res => {
        return (res ? res : []) as ImpactedItemType;
      })
    );
  }

  createImpactedItem(caseObjectID: string, caseObjectType: string, category: string, caseObjectData, payload: ImpactedItem): Observable<any> {
    const categoryServicePath = category === 'SOLUTIONITEM' ? 'scope-items' : 'problem-items';
    const qParams = {
      'change-object-number': caseObjectID,
      'change-object-type': caseObjectType.toUpperCase(),
      'change-owner-type': caseObjectData.changeOwnerType || caseObjectData.change_owner_type || caseObjectData.release_package.change_owner_type
    };
    const url = `${this.miraiURL}change-objects/${categoryServicePath}`;
    return this.http.post(url, payload, {params: qParams}).pipe(
      map(res => {
        return (res ? res : []) as ImpactedItemResponse;
      }), catchError((err) => {
        return of(err);
      })
    );
  }

  updateImpactedItem(caseObjectID: string, caseObjectType: string, category: string, payload: ImpactedItem): Observable<ImpactedItemResponse> {
    const qParams = {
      'view': 'overview'
    };
    const categoryServicePath = category === 'SOLUTIONITEM' ? 'scope-items' : 'problem-items';
    const url = `${this.miraiURL}change-objects/${categoryServicePath}/${caseObjectID}`;
    return this.http.put(url, payload, {params: qParams}).pipe(
      map(res => {
        return (res ? res : []) as ImpactedItemResponse;
      })
    );
  }

  updateChangeOwner(id: string, caseObjectType: string, type: string, payload?: any): Observable<ImpactedItemResponse> {
    const qParams = {
      'view': 'overview'
    };
    const url = `${this.miraiURL}change-objects/${type}/${id}`;
    return this.http.patch(url, payload, {params: qParams}).pipe(
      map(res => {
        return (res ? res : []) as ImpactedItemResponse;
      })
    );
  }

  deleteImpactedItem(impactedItemId, type: string): Observable<ImpactedItemResponse> {
    const qParams = {
      'view': 'overview'
    };
    const url = `${this.miraiURL}change-objects/${type}/${impactedItemId}`;
    return this.http.delete(url, {params: qParams}).pipe(
      map(res => {
        return (res ? res : []) as ImpactedItemResponse;
      })
    );
  }

  updateSolutionItemSequence(id, sequenceNumber, caseAction): Observable<ImpactedItemResponse> {
    const qParams = {
      'case-action': caseAction,
      'view': 'overview'
    };
    const payload = {
      'id': id,
      'sequence': sequenceNumber
    };
    const url = `${this.miraiURL}change-objects/scope-items`;
    return this.http.put(url, payload, {params: qParams}).pipe(
      map(res => {
        return (res ? res : []) as ImpactedItemResponse;
      })
    );
  }

  getSDLScopeMonitorList(rpNumber, caseObjectType): Observable<any[]> {
    const qParams = {
      'change-object-number': rpNumber,
      'change-object-type': caseObjectType
    };
    const url = `${this.miraiURL}change-objects/scope-items/sdl-monitor`;
    return this.http.get(url, {params: qParams}).pipe(
      map(res => {
        return (res ? res : []) as any[];
      }),
      catchError(() => {
        return of([]);
      })
    );
  }

  getNewImpactedItemId(caseObjectId: string, caseObjectType: string, itemType: string, category: string) {
    const qParams = {
      'change-object-number': caseObjectId,
      'change-object-type': caseObjectType,
      'type': itemType
    };
    const categoryServicePath = category === 'SOLUTIONITEM' ? 'scope-items' : 'problem-items';
    const url = `${this.miraiURL}change-objects/${categoryServicePath}/name`;
    return this.http.get(url, {params: qParams}).pipe(
      map(res => {
        return res && res['name'] ? res['name'] :  {};
      }),
      catchError((err) => {
        return of(err);
      })
    );
  }

  getChangeOwnerCaseAction(caseObjectId: string, caseObjectType: string): Observable<any> {
    const qParams = {
      'change-object-number': caseObjectId,
      'change-object-type': caseObjectType,
    };
    const url = `${this.miraiURL}change-objects/case-actions`;
    return this.http.get(url, {params: qParams}).pipe(
      map(res => {
        return (res ? res : []) as any[];
      })
    );
  }

  moveScopeItem(payload: any): Observable<any> {
    const qParams = {
      'case-action': 'MOVE_SCOPE_ITEM',
      'change-object-type': 'RELEASEPACKAGE'
    };
    const url = `${this.miraiURL}change-objects/scope-items`;
    return this.http.post(url, payload, {params: qParams}).pipe(
      map(res => {
        return res ? res : [];
      }), catchError((err) => {
        return of(err);
      })
    );
  }

  getChangeOwnedScopeItem(releasePackageNumber): Observable<any> {
    const qParams = {
      'change-object-number': releasePackageNumber,
      'change-object-type': 'RELEASEPACKAGE',
      'is-change-owner': true + ''
    };
    const url = `${this.miraiURL}change-objects/scope-items`;
    return this.http.get(url, {params: qParams}).pipe(
      map(res => {
        return (res ? res : {}) as any[];
      }),
      catchError(() => {
        return of({});
      })
    );
  }
}
