import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

import {environment} from '../../../environments/environment';
import {
  AuditRecord,
  ReviewAuditAggregate,
  ReviewEntryAuditAggregate,
  ReviewTaskAuditAggregate, User
} from '../../shared/models/mc.model';
import {ServiceParametersService} from './service-parameters.service';
import {PersonNamePipe} from '../../shared/pipes/person-name.pipe';
import {ConfigurationService} from './configurations/configuration.service';

@Injectable({providedIn: 'root'})
export class ReviewAuditLogService {
  azureUrl: string;
  reviewAuditData: any;

  constructor(private readonly httpClient: HttpClient,
              private readonly configurationService: ConfigurationService) {
    this.azureUrl = `${environment.rootURL}review-service`;
    this.reviewAuditData = [];
  }
  getReviewAuditLog(filterObj: any): Observable<any> {
    const id = filterObj['case-id'];
    const url = `${this.azureUrl}/reviews/${id}/change-log?include-deleted=true&view=aggregate`;
    if (this.reviewAuditData.length) {
      return of(this.createPageObject(filterObj));
    }
    return this.httpClient.get(url).pipe(map( (data) => {
      return this.processData(data as ReviewAuditAggregate, filterObj);
    }, () => {
      // handle error response
    }));
  }

  processData(data: ReviewAuditAggregate, filterObj: any) {
    const auditEntries: AuditRecord[] = [];
    if (this.reviewAuditData.length > 0) {
      return this.createPageObject(filterObj);
    }
    if (data.review_change_log.entries) {
      data.review_change_log.entries.forEach(entry => {
        auditEntries.push(new AuditRecord(entry, 'Review', this.getLabel.bind(this), this.getValue.bind(this)));
      });
    }
    if (data.review_tasks_change_log) {
      data.review_tasks_change_log.forEach((reviewTaskAgg: ReviewTaskAuditAggregate) => {
        if (reviewTaskAgg.review_task_change_log.entries) {
          reviewTaskAgg.review_task_change_log.entries.forEach(entry => {
            auditEntries.push(new AuditRecord(entry, 'Reviewer', this.getLabel.bind(this), this.getValue.bind(this)));
          });
        }
        if (reviewTaskAgg.review_entries_change_log) {
          reviewTaskAgg.review_entries_change_log.forEach((reviewEntryAgg: ReviewEntryAuditAggregate) => {
            if (reviewEntryAgg.review_entry_change_log.entries) {
              reviewEntryAgg.review_entry_change_log.entries.forEach(entry => {
                auditEntries.push(new AuditRecord(entry, 'Defect', this.getLabel.bind(this), this.getValue.bind(this)));
              });
            }
          });
        }
      });
    }
    auditEntries.sort((a, b) => new Date(a.changedOn).getTime() - new Date(b.changedOn).getTime());
    this.reviewAuditData = auditEntries.filter(item => item.newValue || item.oldValue);
    return this.createPageObject(filterObj);
  }

  createPageObject(filterObj: any): any {
    if (filterObj['order-by']) {
      const sortUrl = filterObj['order-by'];
      const sortField = sortUrl.split(' ')[0];
      const isAsc = sortUrl.split(' ')[1] === 'asc';
      switch (sortField) {
        case 'field':
          this.reviewAuditData = this.compare('field', isAsc);
          break;
        case 'modified_by':
          this.reviewAuditData = this.compare('changedBy', isAsc);
          break;
        case 'modified_on':
          this.reviewAuditData = this.compareDate('changedOn', isAsc);
          break;
        default: break;
      }
    }
    return {
      totalItems: this.reviewAuditData.length,
      audits: this.reviewAuditData.slice(filterObj['start-position'], filterObj['start-position'] + filterObj['number-of-items'])
    };
  }
  compare(field: string, isAsc: boolean) {
    return this.reviewAuditData.sort((a, b) => isAsc ? a[field] - b[field] : b[field] - a[field]);
  }

  compareDate(field: string, isAsc: boolean) {
    return this.reviewAuditData.sort((a, b) => (isAsc ? new Date(a.changedOn).getTime() - new Date(b.changedOn).getTime() : new Date(b.changedOn).getTime() - new Date(a.changedOn).getTime()));
  }
  getLabel(caseObject: string, property: string): string {
    caseObject = this.getCaseObject(caseObject);
    const label = this.configurationService.getFormFieldOptionDataByValue(caseObject, property, 'label');
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
      caseObject = this.getCaseObject(caseObject);
      if (typeof value === 'object') {
        return value['label'] || value['name'] || value['value'] || value['type'] || value['context_id'] || JSON.stringify(value);
      }
      return this.configurationService.getFormFieldOptionDataByValue(caseObject, property, value.toString(), 'label');
    } else {
      return (value ? value['id'] : '');
    }
  }

  getCaseObject(caseObject: string) {
    if (caseObject === 'Review') {
      return 'Review2.0';
    } else if (caseObject === 'Reviewer') {
      return 'Reviewer2.0';
    } else if (caseObject === 'Defect') {
      return 'ReviewEntry2.0';
    }
  }
}

