import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {
  AuditMember,
  ChangeRequestAuditAggregate,
  ReleasePackageAuditAggregate
} from '../../shared/models/mc-presentation.model';
import {AuditRecord, User} from '../../shared/models/mc.model';
import {ConfigurationService} from './configurations/configuration.service';
import {PersonNamePipe} from '../../shared/pipes/person-name.pipe';

@Injectable({
  providedIn: 'root'
})
export class ReleasePackageAuditLogService {
  rootServiceUrl: string;
  releasePackageAuditData: any;

  constructor(private readonly httpClient: HttpClient,
              public readonly configurationService: ConfigurationService) {
    this.rootServiceUrl = `${environment.rootURL}release-package-service`;
    this.releasePackageAuditData = [];
  }

  getReleasePackageAuditLog(filterObj: any): Observable<any> {
    const id = filterObj['case-id'];
    const url = `${this.rootServiceUrl}/release-packages/${id}/change-log`;
    if (this.releasePackageAuditData.length) {
      return of(this.createPageObject(filterObj));
    }
    return this.httpClient.get(url).pipe(map((data) => {
      return this.processData(data, filterObj);
    }, () => {
      // handle error response
    }));
  }

  processData(data, filterObj) {
    const auditEntries: AuditRecord[] = [];
    if (this.releasePackageAuditData.length > 0) {
      return '';
    }
    if (data.entries) {
      data.entries.forEach(entry => {
        auditEntries.push(new AuditRecord(entry, 'ReleasePackage', this.getLabel.bind(this), this.getValue.bind(this)));
      });
    }
    auditEntries.sort((a, b) => new Date(a.changedOn).getTime() - new Date(b.changedOn).getTime());
    this.releasePackageAuditData = auditEntries.filter(item => item.newValue || item.oldValue);
    return this.createPageObject(filterObj);
  }

  createPageObject(filterObj: any): any {
    if (filterObj['order-by']) {
      const sortUrl = filterObj['order-by'];
      const sortField = sortUrl.split(' ')[0];
      const isAsc = sortUrl.split(' ')[1] === 'asc';
      switch (sortField) {
        case 'field':
          this.releasePackageAuditData = this.compare('field', isAsc);
          break;
        case 'modified_by':
          this.releasePackageAuditData = this.compare('changedBy', isAsc);
          break;
        case 'modified_on':
          this.releasePackageAuditData = this.compareDate('changedOn', isAsc);
          break;
        default:
          break;
      }
    }
    return {
      totalItems: this.releasePackageAuditData.length,
      audits: this.releasePackageAuditData.slice(filterObj['start-position'], filterObj['start-position'] + filterObj['number-of-items'])
    };
  }

  compare(field: string, isAsc: boolean) {
    return this.releasePackageAuditData.sort((a, b) => (a[field] < b[field] ? -1 : 1) * (isAsc ? 1 : -1));
  }

  compareDate(field: string, isAsc: boolean) {
    return this.releasePackageAuditData.sort((a, b) => (isAsc ? new Date(a.changedOn).getTime() - new Date(b.changedOn).getTime() : new Date(b.changedOn).getTime() - new Date(a.changedOn).getTime()));
  }

  getLabel(caseObject: string, property: string): string {
    const label = this.configurationService.getFormFieldOptionDataByValue('ReleasePackage2.0', property, 'label');
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
      return this.configurationService.getFormFieldOptionDataByValue('ReleasePackage2.0', property, typeof value === 'number' ? value.toString() : value, 'label');
    } else {
      return (value ? value['id'] : '');
    }
  }
}


