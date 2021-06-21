import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Agenda, ChangeRequest} from '../../shared/models/mc.model';
import {AgendaCBRuleSet, ProductsAffectedSet} from '../../shared/models/mc-presentation.model';

@Injectable({
  'providedIn': 'root'
})
export class ManageCbRulesService {
  private readonly ruleSetUrl: string;
  private readonly cbRuleUrl: string;

  constructor(private readonly http: HttpClient) {
    this.ruleSetUrl = `${environment.rootURL}configuration-service/rule-sets`;
    this.cbRuleUrl = `${environment.rootURL}mc${environment.version}`;
  }

  getCBRuleset(): Observable<AgendaCBRuleSet[]> {
    return this.http.get(this.ruleSetUrl, { headers: { 'ngsw-bypass': 'true' }})
      .pipe(
        map(res => {
          return ((res) ? res : []) as AgendaCBRuleSet[];
        })
      );
  }

  addRuleSet(ruleSetLabel: string, ruleSetHelp: string): Observable<AgendaCBRuleSet> {
    const ruleSetPayload = {
      'label': ruleSetLabel,
      'help': ruleSetHelp,
      'rules': []
    };
    return this.http.post(`${this.ruleSetUrl}`, ruleSetPayload).pipe(map(res => {
      return (res ? res : {}) as AgendaCBRuleSet;
    }));
  }

  addRule(ruleSetPayload, ruleSetName): Observable<AgendaCBRuleSet> {
    return this.http.put(`${this.ruleSetUrl}/${ruleSetName}`, ruleSetPayload).pipe(map(res => {
      return (res ? res : {}) as AgendaCBRuleSet;
    }));
  }

  deleteRuleSet(ruleSetName): Observable<any> {
    return this.http.delete(`${this.ruleSetUrl}/${ruleSetName}`);
  }

  deleteRule(ruleSet): Observable<AgendaCBRuleSet> {
    return this.http.put(`${this.ruleSetUrl}/${ruleSet.name}`, ruleSet).pipe(map(res => {
      return (res ? res : {}) as AgendaCBRuleSet;
    }));
  }

  updateRuleSet(editedRulePayload, ruleSetName) {
    return this.http.put(`${this.ruleSetUrl}/${ruleSetName}`, editedRulePayload).pipe(map(res => {
      return (res ? res : {}) as AgendaCBRuleSet;
    }));
  }

  updateRule(editedRulePayload, ruleSetName) {
    return this.http.put(`${this.ruleSetUrl}/${ruleSetName}`, editedRulePayload).pipe(map(res => {
      return (res ? res : {}) as AgendaCBRuleSet;
    }));
  }

  updateCBRuleSet(ruleSetElement, agendaItemID, action: string, type: string): Observable<Agenda | ChangeRequest> {
    const payload = {
      'RuleSetElement': ruleSetElement
    };
    let isTyeUrl: string;
    const qParams = {
      'case-action': action
    };
    if (type === 'AgendaItem') {
      isTyeUrl = 'agenda-items';
    } else {
      isTyeUrl = 'change-requests';
    }
    return this.http.put(`${this.cbRuleUrl}/${isTyeUrl}/${agendaItemID}/cb-rule-set`, payload, {params: qParams}).pipe(map(res => {
      if (type === 'AgendaItem') {
        return (res && res['RuleSetElement'] ? res['RuleSetElement'] : {}) as Agenda;
      } else if (type === 'ChangeRequest') {
        return (res && res['ChangeRequestElement'].changeBoardRuleSet ? res['ChangeRequestElement'].changeBoardRuleSet : {}) as ChangeRequest;
      }
    }));
  }
}
