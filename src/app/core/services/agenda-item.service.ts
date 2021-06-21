import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs/Rx';
import {of, pipe} from 'rxjs';

import {environment} from '../../../environments/environment';
import {Agenda, AgendaItem, User} from '../../shared/models/mc.model';
import {AgendaSectionUpdateItem} from '../../shared/models/agenda.model';
import {AgendaItemDetail, AgendaOverview, UpdatedAgendaItems} from '../../agenda/agenda.model';
import {AgendaItemAttendeesSummary, AttendeesSummary} from '../../shared/models/mc-presentation.model';
import {HelpersService} from '../utilities/helpers.service';
import {Problem} from '../../shared/models/air.model';
import {ProductBreakdownStructure} from '../../shared/models/product-breakdown-structure.model';

@Injectable({
  'providedIn': 'root'
})

export class AgendaItemService {
  agendaItemsUrl: string;

  constructor(private readonly http: HttpClient,
              private readonly helpersService: HelpersService) {
    this.agendaItemsUrl = `${environment.rootURL}mc${environment.version}/agenda-items`;
  }

  createAgendaItem(aggregatedElement, agendaId): Observable<AgendaOverview> {
    let payLoad = this.helpersService.removeEmptyKeysFromObject(aggregatedElement);
    payLoad = {
      'AggregatedAgendaItemElement': payLoad
    };
    return this.http.post(`${environment.rootURL}mc${environment.version}/agendas/${agendaId}/agenda-items`, payLoad).pipe(map(res => {
      return (res ? res : {}) as AgendaOverview;
    }));
  }

  updateOfflineAgendaItem(aggregatedElement, agendaId): Observable<AgendaOverview> {
    let payLoad = this.helpersService.removeEmptyKeysFromObject(aggregatedElement);
    payLoad = {
      'AggregatedAgendaItemElement': payLoad
    };
    return this.http.put(`${this.agendaItemsUrl}/view/link-agenda?agenda-id=${agendaId}`, payLoad).pipe(map(res => {
      return (res ? res : {}) as AgendaOverview;
    }));
  }

  deleteAgendaItem(id): Observable<{}> {
    return this.http.delete(`${this.agendaItemsUrl}/${id}`);
  }

  updateAgendaSequence(agendaId, sequenceNumber, section: string): Observable<UpdatedAgendaItems> {
    const url = `${this.agendaItemsUrl}/${agendaId}?action=update-sequence`;
    const payload = {
      'agendaSequenceNumber': sequenceNumber,
      'section': section
    };
    return this.http.put(url, payload) as Observable<UpdatedAgendaItems>;
  }

  deleteSection(section, agendaId): Observable<{}> {
    const url = `${this.agendaItemsUrl}?agendaID=${agendaId}&action=delete-section`;
    const payload = {
      'section': section
    };
    return this.http.put(url, payload);
  }

  updateSection(agendaItems): Observable<UpdatedAgendaItems> {
    const url = `${this.agendaItemsUrl}?action=update-section`;
    const payload = {'AgendaItemSectionElement': []};
    agendaItems.forEach((agendaItem) => {
      payload.AgendaItemSectionElement.push({
        'ID': agendaItem.ID,
        'sequenceNumber': agendaItem.agendaSequenceNumber,
        'section': agendaItem.section
      } as AgendaSectionUpdateItem);
    });
    return this.http.put(url, payload).pipe(map(res => {
      return (res ? res : {'agendaItems': []}) as UpdatedAgendaItems;
    }));
  }

  getAgendaItemAttendees(id, isLookupRequired?: boolean): Observable<AgendaItemAttendeesSummary> {
    const qParams = {
      ...((isLookupRequired === false || isLookupRequired === true) ? {'is-exchange-lookup-required': isLookupRequired + ''} : {})
    };
    return this.http.get(`${this.agendaItemsUrl}/${id}/attendees`, {params: qParams}).pipe(map(res => {
      return res as any;
    }));
  }

  addAttendees(id, attendees): Observable<AttendeesSummary> {
    const payload = {
      'attendees': attendees
    };
    return this.http.put(`${this.agendaItemsUrl}/${id}?action=add-attendees`, payload).pipe(map(res => {
      return res as any;
    }));
  }

  deleteAttendees(id, attendees): Observable<{}> {
    const payload = {
      'attendees': attendees.map((obj) => new User(obj))
    };
    return this.http.put(`${this.agendaItemsUrl}/${id}?action=delete-attendees`, payload);
  }

  performActionOnAgendaItem(id: string, action: string): Observable<AgendaItem> {
    return this.http.put(`${this.agendaItemsUrl}/${id}?action=${action}`, null).pipe(map(res => {
      if (res && res['AggregatedAgendaItemElement']) {
        return res['AggregatedAgendaItemElement'];
      }
      return res;
    }));
  }

  getAIRItems(id: string): Observable<Problem[]> {
    const qParams = {
      'agenda-item-id': id
    };
    return this.http.get(`${environment.rootURL}change-request-service/change-requests/problems`, {params: qParams}).pipe(map(res => {
      return res  ? res as Problem[] : [] as Problem[];
    }));
  }

  getPBSItems(id: string): Observable<ProductBreakdownStructure[]> {
    const qParams = {
      'agenda-item-id': id
    };
    return this.http.get(`${environment.rootURL}change-request-service/change-requests/product-breakdown-structures`, {params: qParams}).pipe(map(res => {
      return (res ? res : []) as ProductBreakdownStructure[];
    }));
  }
}


