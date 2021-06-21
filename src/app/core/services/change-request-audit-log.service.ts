import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {AuditMember, ChangeRequestAuditAggregate} from '../../shared/models/mc-presentation.model';
import {AuditRecord, User} from '../../shared/models/mc.model';
import {ConfigurationService} from './configurations/configuration.service';
import {PersonNamePipe} from '../../shared/pipes/person-name.pipe';

@Injectable({
  providedIn: 'root'
})
export class ChangeRequestAuditLogService {
  rootServiceUrl: string;
  changeRequestAuditData: any;

  constructor(private readonly httpClient: HttpClient,
              public readonly configurationService: ConfigurationService) {
    this.rootServiceUrl = `${environment.rootURL}change-request-service`;
    this.changeRequestAuditData = [];
  }

  getChangeRequestAuditLog(filterObj: any): Observable<any> {
    const qParam = {'view': 'aggregate'};
    const id = filterObj['case-id'];
    const url = `${this.rootServiceUrl}/change-requests/${id}/change-log`;
    if (this.changeRequestAuditData.length) {
      return of(this.createPageObject(filterObj));
    }
    return this.httpClient.get(url, {params: qParam}).pipe(map((data) => {
      return this.processData(data as ChangeRequestAuditAggregate, filterObj);
    }, () => {
      // handle error response
    }));
  }

  processData(data: ChangeRequestAuditAggregate, filterObj) {
    const auditEntries: AuditRecord[] = [];
    if (this.changeRequestAuditData.length > 0) {
      return '';
    }
    if (data.change_request_change_log.entries) {
      data.change_request_change_log.entries.forEach(entry => {
        auditEntries.push(new AuditRecord(entry, 'ChangeRequest', this.getLabel.bind(this), this.getValue.bind(this)));
      });
    }
    if (data.scope_change_log.entries) {
      data.scope_change_log.entries.forEach(entry => {
        // Temporarily hiding part_detail, packaging_detail and tooling_detail
        if (entry.property !== 'id' && entry.property !== 'part_detail' && entry.property !== 'packaging_detail' && entry.property !== 'tooling_detail') {
          entry.property = 'scope.' + entry.property;
          auditEntries.push(new AuditRecord(entry, 'ChangeRequest', this.getLabel.bind(this), this.getValue.bind(this)));
        }
      });
    }
    if (data.solution_definition_change_log.entries) {
      data.solution_definition_change_log.entries.forEach(entry => {
        if (entry.property !== 'id') {
          entry.property = 'solution_definition.' + entry.property;
          auditEntries.push(new AuditRecord(entry, 'ChangeRequest', this.getLabel.bind(this), this.getValue.bind(this)));
        }
      });
    }
    if (data.impact_analysis && data.impact_analysis.details && data.impact_analysis.general) {
      data.impact_analysis.general.entries.forEach(entry => {
        if (entry.property !== 'id') {
          entry.property = 'impact_analysis.' + entry.property;
          auditEntries.push(new AuditRecord(entry, 'ChangeRequest', this.getLabel.bind(this), this.getValue.bind(this)));
        }
      });
      Object.keys(data.impact_analysis.details).forEach((impactAnalysisKey) => {
        data.impact_analysis.details[impactAnalysisKey].entries.forEach(entry => {
          if (entry.property !== 'id') {
            entry.property = (impactAnalysisKey === 'complete_business_case' ? 'complete_business_case.' + entry.property : 'impact_analysis.' + impactAnalysisKey + '.' + entry.property);
            auditEntries.push(new AuditRecord(entry, 'ChangeRequest', this.getLabel.bind(this), this.getValue.bind(this)));
          }
        });
      });
    }
    if (data.my_team_details && data.my_team_details.members) {
      data.my_team_details.members.forEach((member: AuditMember) => {
        member.member.entries.forEach((entry) => {
          if (entry.property !== 'id') {
            entry.property = 'my_team.members.member.' + entry.property;
            auditEntries.push(new AuditRecord(entry, 'ChangeRequest', this.getLabel.bind(this), this.getValue.bind(this)));
          }
        });
      });
      data.my_team_details.my_team.entries.forEach((entry) => {
        if (entry.property !== 'id') {
          entry.property = 'my_team.' + entry.property;
          auditEntries.push(new AuditRecord(entry, 'ChangeRequest', this.getLabel.bind(this), this.getValue.bind(this)));
        }
      });
    }
    auditEntries.sort((a, b) => new Date(a.changedOn).getTime() - new Date(b.changedOn).getTime());
    this.changeRequestAuditData = auditEntries.filter(item => item.newValue || item.oldValue);
    return this.createPageObject(filterObj);
  }

  createPageObject(filterObj: any): any {
    if (filterObj['order-by']) {
      const sortUrl = filterObj['order-by'];
      const sortField = sortUrl.split(' ')[0];
      const isAsc = sortUrl.split(' ')[1] === 'asc';
      switch (sortField) {
        case 'field':
          this.changeRequestAuditData = this.compare('field', isAsc);
          break;
        case 'modified_by':
          this.changeRequestAuditData = this.compare('changedBy', isAsc);
          break;
        case 'modified_on':
          this.changeRequestAuditData = this.compareDate('changedOn', isAsc);
          break;
        default:
          break;
      }
    }
    return {
      totalItems: this.changeRequestAuditData.length,
      audits: this.changeRequestAuditData.slice(filterObj['start-position'], filterObj['start-position'] + filterObj['number-of-items'])
    };
  }

  compare(field: string, isAsc: boolean) {
    return this.changeRequestAuditData.sort((a, b) => (a[field] < b[field] ? -1 : 1) * (isAsc ? 1 : -1));
  }

  compareDate(field: string, isAsc: boolean) {
    return this.changeRequestAuditData.sort((a, b) => (isAsc ? new Date(a.changedOn).getTime() - new Date(b.changedOn).getTime() : new Date(b.changedOn).getTime() - new Date(a.changedOn).getTime()));
  }

  getLabel(caseObject: string, property: string): string {
    const label = this.configurationService.getFormFieldOptionDataByValue('ChangeRequest2.0', property, 'label');
    return label !== 'label' ? label : property;
  }

  getValue(caseObject: string, property: string, value: any): string {
    if (!value) {
      return '';
    }
    if (property) {
      if (value['user_id']) {
        const userNamePipe = new PersonNamePipe();
        return userNamePipe.transform(value as User);
      } else if (property.toLowerCase().indexOf('date') > -1) {
        return value;
      }
      if (typeof value === 'object') {
        return value['label'] || value['name'] || value['value'] || value['type'] || value['context_id'] || JSON.stringify(value);
      }
      return this.configurationService.getFormFieldOptionDataByValue('ChangeRequest2.0', property, typeof value === 'number' ? value.toString() : value, 'label');
    } else {
      return (value ? value['id'] : '');
    }
  }
}


