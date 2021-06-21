import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {environment} from '../../../environments/environment';
import {AgendaItemDetail, AgendaOverview, Meeting, MeetingResponse} from '../../agenda/agenda.model';
import {Agenda, AgendaItem, CaseObject, ChangeRequest, User} from '../../shared/models/mc.model';
import {HelpersService} from '../utilities/helpers.service';
import {Group} from '../../shared/models/user-profile.model';
import {
  AggregatedAgendaItem,
  AggregatedAgendaList,
  AttendeeSummary, CaseObjectContext,
  MeetingElement, Product,
  SectionSummary,
  SpecialInviteesData
} from '../../shared/models/mc-presentation.model';
import {UserProfileService} from './user-profile.service';
import {CaseObjectOverview} from '../../shared/components/case-object-list/case-object-list.model';

@Injectable({
  'providedIn': 'root'
})
export class AgendaService {
  numberOfItems = 'number-of-items';
  startPosition = 'start-position';
  private readonly rootUrl = `${environment.rootURL}mc${environment.version}`;
  private readonly url: string;
  private readonly agendaItemUrl: string;
  private readonly actionUrl: string;

  constructor(private readonly http: HttpClient,
              private readonly userProfile: UserProfileService,
              private readonly helpersService: HelpersService) {
    this.url = `${environment.rootURL}mc${environment.version}/agendas`;
    this.agendaItemUrl = `${environment.rootURL}mc${environment.version}/agenda-items`;
    this.actionUrl = `${environment.rootURL}mc${environment.version}/actions`;
  }

  deleteAgenda(id): Observable<{}> {
    return this.http.delete(`${this.url}/${id}`);
  }

  getAgenda(id): Observable<Agenda> {
    return this.http.get(`${this.url}/${id}`).pipe(map(res => {
      return res && res['AgendaElement'] ? res['AgendaElement'] : {};
    }), catchError(() => {
      return of({} as Agenda);
    }));
  }

  startMeeting(id): Observable<Agenda> {
    const url = `${this.url}/${id}?action=prepare-minutes`;
    const payload = {
      'AgendaElement': {
        'ID': id
      }
    };
    return this.http.put(url, payload).pipe(map(res => {
      return res ? res['AgendaElement'] : {};
    }), catchError(() => of({} as Agenda)));
  }

  putAgendaItemAttendees(currentID, nextID): Observable<string> {
    const payload = {
      'AgendaElement': {
        'ID': currentID
      }
    };
    return this.http.put(`${this.agendaItemUrl}/view/attendees?next-agendaitem-id=${nextID}&current-agendaitem-id=${currentID}`, payload).pipe(map(res => {
      return res && res['AggregatedAgendaItemElement'] ? res['AggregatedAgendaItemElement'] : {};
    }));
  }

  getAgendaOverview(id: string, view: string): Observable<AgendaOverview> {
    const qParams = {'agenda-id': id, 'view': view};
    return this.http.get(`${this.agendaItemUrl}/view/overview`, {params: qParams}).pipe(map(res => {
      return (res ? res : {}) as AgendaOverview;
    }), catchError(() => of({} as AgendaOverview)));
  }

  getAgendaItemFullDetails(id: string): Observable<AgendaOverview> {
    const qParams = {'agenda-item-id': id, 'view': 'Full'};
    return this.http.get(`${this.agendaItemUrl}/view/overview`, {params: qParams}).pipe(map(res => {
      return (res ? res : {}) as AgendaOverview;
    }));
  }

  getCrForAgendaLinkSummary(id): Observable<any> {
    // Removed context.type: 'AGENDAITEM' from query params as suggested by backend team, need to replace it once issue is fixed
    // const qParams = {'view': 'agenda-link-summary', 'criteria': `contexts.context_id@"${id}" and context.type:'AGENDAITEM'`};
    const qParams = {'view': 'agenda-link-summary', 'agenda-item-ids': `"${id}"`};
    return this.http.get(`${environment.rootURL}change-request-service/change-requests`, {params: qParams}).pipe(map(res => {
      return res ? res : [];
    }));
  }

  getCRDetailsForAgendaItem(id: string): Observable<CaseObjectOverview> {
    const qParams = {'agenda-item-id': `${id}`};
    return this.http.get(
      `${environment.rootURL}change-request-service/change-requests`, {params: qParams}).pipe(map(res => {
      return (res ? res : {}) as CaseObjectOverview;
    }), catchError(() => of({} as CaseObjectOverview)));

  }

  getProductDetailsForAgendaItem(id: string): Observable<Product> {
    const qParams = {'agenda-item-id': `${id}`};
    return this.http.get(
      `${environment.rootURL}change-request-service/change-requests/product`, {params: qParams}).pipe(map(res => {
      return (res ? res : {}) as Product;
    }), catchError(() => of({} as Product)));
  }

  getAgendaForAgendaItem(id): Observable<string> {
    return this.http.get(`${this.url}?filter=agendaItem.ID in (${id})`).pipe(map(res => {
      return res && res['AgendaElement'] ? res['AgendaElement'][0]['ID'] : '';
    }));
  }

  getAgendaForAgendaItemAggregated(id): Observable<AgendaItemDetail> {
    return this.http.get(`${this.agendaItemUrl}/${id}/view/aggregated`).pipe(map(res => {
      return res && res['AggregatedAgendaItemElement'] ? res['AggregatedAgendaItemElement'] : {};
    }));
  }

  getMeetingInfo(id: string): Observable<Meeting> {
    id = id.replace(/\//g, '{slash}');
    id = id.replace(/\+/g, '{plus}');
    id = id.replace(/\=/g, '{equal}');
    const url = `${environment.rootURL}exchange${environment.version}/meetings/${id}`;
    return this.http.get(url).pipe(map(res => {
      return (res && res['meeting'] ? res['meeting'] : {}) as Meeting;
    }));
  }

  createNewAgenda$(agendaCategory: string): Observable<Agenda> {
    const payload = {
      'AgendaElement': {
        'category': agendaCategory
      },
    };
    return this.http.post(this.url, payload).pipe(
      map(res => {
        return (res && res['AgendaElement'] ? res['AgendaElement'] : {}) as Agenda;
      }));
  }

  updateAgenda(agendaElement, action?: string, ID?: string, type?: string, linkObjectSummaryElement?): Observable<Agenda> {
    let payload = {
      'AgendaElement': agendaElement,
      ...(linkObjectSummaryElement && linkObjectSummaryElement.length > 0 ? {'linkObjectSummaryElement': linkObjectSummaryElement} : {})
    };
    payload = this.helpersService.removeEmptyKeysFromObject(payload);
    const qParams = {
      'action': action,
      'type': type
    };
    return this.http.put(`${this.url}/${ID}`, payload, {params: qParams}).pipe(map(res => {
      return res ? res : {};
    }));
  }

  getGroups(): Observable<Group[]> {
    const url = `${environment.rootURL}mc${environment.version}/groups`;
    return this.http.get(url).pipe(map(res => {
      return (res && res['groups'] ? res['groups'] : []) as Group[];
    }));
  }

  getMeetingDates$(fromDate: Date, toDate: Date): Observable<Meeting[]> {
    const qParams = new HttpParams()
      .set('start-date-time', fromDate.toISOString())
      .set('end-date-time', toDate.toISOString());

    return this.http.get<MeetingResponse>(`${environment.rootURL}mc${environment.version}/meetings`, {params: qParams})
      .pipe(map((res) => {
        return res && res.meeting ? res.meeting : [];
      }));
  }

  getCRDetailsForMultipleAgendaItemIds(ids): Observable<any> {
    const qParams = {
      'view': 'agenda-link-summary',
      // Removed context.type: 'AGENDAITEM' from query params as suggested by backend team, need to replace it once issue is fixed
      // 'criteria': `contexts.context_id@"${ids}" and contexts.type:"AGENDAITEM"`
      'agenda-item-ids': `"${ids}"`,
      'include-ruleset': 'true'
      };
    return this.http.get(`${environment.rootURL}change-request-service/change-requests`, {params: qParams}).pipe(map(res => {
      return res ? res : {};
    }));
  }

  createCloneAgenda(id: string, linkObjectSummaryElement): Observable<Agenda> {
    const payload = {
      'AgendaElement': {
        'ID': id
      },
      ...(linkObjectSummaryElement && linkObjectSummaryElement.length ? {'linkObjectSummaryElement': linkObjectSummaryElement} : {})
    };
    return this.http.post(`${this.url}?action=clone-agenda`, payload).pipe(map(res => {
      return (res  ? res : {}) as Agenda;
    }));
  }

  getAgendasList(startDateTime, endDateTime, startPosition, numberOfItems, filter?: string, orderBy?: string): Observable<AggregatedAgendaList> {

    const url = `${environment.rootURL}mc${environment.version}/agendas`;
    const queryObj = {
      ...(startDateTime ? {'startDateTime': startDateTime} : {}),
      ...(endDateTime ? {'endDateTime': endDateTime} : {}),
      'start-position': startPosition,
      'number-of-items': numberOfItems,
      ...(filter ? {'filter': filter} : {}),
      ...(orderBy ? {'order-by': orderBy} : {})
    };

    return this.http.get(url + '/view/summary', {params: queryObj})
      .pipe(
        map(response => {
          return {
            totalItems: response['totalItems'],
            aggregatedAgendas: response['AgendaSummaryElement']
          } as AggregatedAgendaList;
        }),
        catchError(() => {
          return of({
            totalItems: 0,
            aggregatedAgendas: []
          } as AggregatedAgendaList);
        })
      );
  }

  getAgendaItemsOverviewDetails(agendaID: string) {
    const url = `${this.agendaItemUrl}/view/linked-categorized-summary`;
    const qParams = {
      'link-type': 'Agenda',
      'link-id': agendaID,
      'number-of-items': '100',
      'start-position': '0',
    };
    return this.http.get(url, {params: qParams}).pipe(map(res => {
      return res;
    }));
  }

  getSpecialInvitees(agendaItemId: string): Observable<SpecialInviteesData> {
    const url = `${this.agendaItemUrl}/${agendaItemId}/special-invitees`;
    return this.http.get(url).pipe(map(res => {
      return res as SpecialInviteesData;
    }), catchError(() => {
      return of({
        totalInviteesCount: 0,
        specialInvitees: [] as User[]
      } as SpecialInviteesData);
    }));
  }

  addSpecialInvitee(agendaItemID, invitees: User[]) {
    const url = `${this.agendaItemUrl}/${agendaItemID}?action=add-special-invitee`;
    const payload = {
      'specialInvitees': invitees
    };
    return this.http.put(url, payload).pipe(map(res => {
      return res ? res : of({});
    }), catchError(() => of({})));
  }

  deleteSpecialInvitee(agendaItemID: string, invitee: User) {
    const url = `${this.agendaItemUrl}/${agendaItemID}?action=delete-special-invitee`;
    const payload = {
      'specialInvitee': [invitee]
    };
    return this.http.put(url, payload).pipe(map(res => {
      return res ? res : of({});
    }), catchError(() => of({})));
  }

  addAgendaItems(agendaID: string, aggregatedItems: AggregatedAgendaItem[]): Observable<AgendaOverview> {
    let payload = {
      'AggregatedAgendaItemElement': aggregatedItems
    };
    payload = this.helpersService.removeEmptyKeysFromObject(payload);
    const url = `${this.rootUrl}/agendas`;
    return this.http.post(`${url}/${agendaID}/agenda-items`, payload).pipe(map(res => {
      return (res ? res : of({})) as AgendaOverview;
    }));
  }

  getSectionDetails(agendaItemId: string): Observable<SectionSummary[]> {
    const url = `${this.url}/${agendaItemId}/view/section-summary`;
    return this.http.get(url).pipe(map(res => {
      return res['agendaSectionDetails'] as SectionSummary[];
    }), catchError(() => of([])));
  }

  getAgendaUpdatePreview(mode: string, agendaItemId: string, timezone: string, mailBody: any, invitees?: string): Observable<MeetingElement> {
    const entity = mode === 'MINUTES' ? 'send-mom' : 'send-agenda';
    timezone = timezone ? encodeURIComponent(timezone) : '';
    let updateURL = `${this.url}/${agendaItemId}/view/${entity}?message-body=${mailBody}&user-timezone=${timezone}`;
    updateURL = (invitees) ? (updateURL + `&invitee-user-ids=` + invitees) : updateURL;
    return this.http.get(updateURL).pipe(map(res => {
      return (res ? res : {}) as MeetingElement;
    }));
  }

  getAgendaAttendees(agendaID: string): Observable<AttendeeSummary> {
    const updateURL = `${this.url}/${agendaID}/view/agenda-attendees`;
    return this.http.get(updateURL).pipe(map(res => {
      return (res ? res : {}) as AttendeeSummary;
    }));
  }

  sendUpdateOrMinutes(agendaItemId: string, type, message, timezone: string, invitees: User[], linkObjectSummaryList, agendaType, flag): Observable<any> {
    const url = (type === 'MINUTES') ?
      `${this.url}/${agendaItemId}?action=COMPLETE&agenda-type=` + `${agendaType}` + `&perform-case-action=` + `${flag}` :
      `${this.url}/${agendaItemId}?action=SEND-AGENDA&agenda-type=` + `${agendaType}` + `&perform-case-action=` + `${flag}`;
    const payload = {
      'UserMessage': message,
      ...(timezone ? {'UserTimezone': timezone} : {}),
      ...(invitees && invitees.length > 0 ? {'AllInvitees': invitees} : {}),
      ...(linkObjectSummaryList ? {'linkObjectSummaryElement': linkObjectSummaryList} : {})
    };
    return this.http.put(url, payload).pipe(map(res => {
      return res ? res : of({});
    }), catchError(() => of({})));
  }

  updatePurpose(agendaItemId: string, oldPurpose: string, newPurpose: string) {
    const qParams = {
      'old-purpose': oldPurpose || '',
      'new-purpose': newPurpose
    };
    const payLoad = {};
    const url = `${this.rootUrl}/agenda-items/${agendaItemId}/purpose`;
    return this.http.put(url, payLoad, {params: qParams}).pipe(map(res => {
      return (res && res['AgendaItemElement'] ? res['AgendaItemElement'] : {}) as AgendaItem;
    }));
  }

  createOfflineAgendaItem(linkedObject: CaseObjectContext) {
    const payload = {
      'AggregatedAgendaItemElement': {
        'agendaItem': {
        'category': 'CB'
        },
        'linkedObjectSummary': linkedObject
      }
    };
    return this.http.post(this.agendaItemUrl, payload).pipe(
      map(res => {
        return (res && res['AgendaItemElement'] ? res['AgendaItemElement'] : {}) as AgendaItem;
      }));
  }

  getLinkedAgendaItems(id: string): Observable<string[]> {
    const qParams = {
      'agenda-id': id
    };
    const url = `${this.url}/view/linked-agenda-items`;
    return this.http.get(url, {params: qParams}).pipe(
      map(res => {
        return (res ? res : []) as string[];
      })
    );
  }

  getLinkedCrForAgendaItem(id: string): Observable<any> {
    const qParams = {
      'agenda-item-id': id
    };
    const url = `${this.agendaItemUrl}/view/linked-change-request`;
    return this.http.get(url, {params: qParams}).pipe(
      map(res => {
        return (res ? res : {}) ;
      }), catchError(() => of({}))
    );
  }
}
