import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform} from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import { of } from 'rxjs';
import {Router} from '@angular/router';

import {HistoryQuickCardComponent} from './history-quick-card.component';
import {AuditLogService} from '../../../core/services/audit-log.service';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';


describe('HistoryQuickCardComponent', () => {
  let component: HistoryQuickCardComponent;
  let fixture: ComponentFixture<HistoryQuickCardComponent>;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HistoryQuickCardComponent, DateDisplayPipeMock],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatMenuModule, MatTooltipModule, RouterTestingModule, HttpClientModule, MatDialogModule],
      providers: [
        {provide: AuditLogService, useClass: AuditLogServiceMock},
        {provide: ServiceParametersService, useClass: ServiceParameterServiceMock},
        {provide: Router, useValue: mockRouter},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryQuickCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set historyItem, when getCaseObjectHistory returns valid response', () => {
    component.caseObjectType = 'ChangeRequest';
    component.caseObjectId = '123456';
    component.getCaseObjectHistory();
    expect(component.historyItems.length).toBeGreaterThan(0);
  });

  it('should navigate to audit log page when caseObjectType is not myTeam and showAllHistory is triggered', () => {
    component.caseObjectType = 'changeRequest';
    component.caseObjectId = '123456';
    component.showAllHistory();
    expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it('should navigate to myTeam history page when caseObjectType is myTeam and showAllHistory is triggered', () => {
    component.caseObjectType = 'myTeam';
    component.secondaryCaseObjectType = 'change-requests';
    component.caseObjectId = '123456';
    component.showAllHistory();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['my-team/change-requests/123456/history']);
  });

  it('should set historyItem, when getReviewHistory returns valid response', () => {
    component.caseObjectType = 'review';
    component.caseObjectId = '1';
    component.getCaseObjectHistory();
    expect(component.historyItems.length).toEqual(2);
  });

  it('should not set historyItem, when getReviewHistory returns invalid response', () => {
    component.caseObjectType = 'review';
    component.caseObjectId = '2';
    component.getCaseObjectHistory();
    expect(component.historyItems.length).toEqual(0);
  });

  it('should set historyItem, when secondaryCaseObjectType is change-requests and getMyTeamHistory returns valid response', () => {
    component.caseObjectType = 'myTeam';
    component.secondaryCaseObjectType = 'change-requests';
    component.caseObjectId = '1';
    component.getCaseObjectHistory();
    expect(component.historyItems.length).toEqual(2);
  });

  it('should set historyItem, when secondaryCaseObjectType is release-packages and getMyTeamHistory returns valid response', () => {
    component.caseObjectType = 'myTeam';
    component.secondaryCaseObjectType = 'release-packages';
    component.caseObjectId = '1';
    component.getCaseObjectHistory();
    expect(component.historyItems.length).toEqual(2);
  });

  it('should not set historyItem, when secondaryCaseObjectType is change-notices and getMyTeamHistory returns invalid response', () => {
    component.caseObjectType = 'myTeam';
    component.secondaryCaseObjectType = 'change-notices';
    component.caseObjectId = '2';
    component.getCaseObjectHistory();
    expect(component.historyItems.length).toEqual(0);
  });

  it('should not set historyItem, when secondaryCaseObject is invalid', () => {
    component.caseObjectType = 'myTeam';
    component.secondaryCaseObjectType = '';
    component.caseObjectId = '2';
    component.getCaseObjectHistory();
    expect(component.historyItems.length).toEqual(0);
  });

});

@Pipe({name: 'dateFormat'})
class DateDisplayPipeMock implements PipeTransform {
  transform(value: any, ...args): any {
    return '02:02:2020';
  }
}

class AuditLogServiceMock {
  getCaseObjectHistory(caseObjectId, caseObjectType) {
    return of({allHistoryCount: 2, StatusHistory: {statusHistoryDetails: [{test: 'test3'}]}});
  }

  getReviewHistory(id, type) {
    if (id === '1') {
      return of({entries: [{id: 62,
          old_value: null,
          property: null,
          revision: 8904,
          revision_type: 'ADD',
          updated_on: '2019-03-07T00:00:00.000+00:00',
          updater: {
            abbreviation: '',
            department_name: 'NULL',
            email: null,
            full_name: '',
            user_id: 'tibco-admin'}},
          {id: 63,
            old_value: null,
            property: null,
            revision: 890,
            revision_type: 'REMOVE',
            updated_on: '2019-03-07T00:00:00.000+00:00',
            updater: {
              abbreviation: '',
              department_name: 'NULL',
              email: null,
              full_name: '',
              user_id: 'tibco-admin'}}]});
    } else {
      return of({});
    }
  }

  getMyTeamHistory(id, type) {
    if (id === '1') {
      return of({
        MyTeamHistory: {
          myTeamHistoryDetails: [
            {
              action: 'ADDED',
              userModified: {
                userID: 'q04test',
                fullName: 'Q 04test',
                email: 'q04test@example.qas',
                abbreviation: 'Q04',
                departmentName: 'IT & BPI Automation'
              },
              modifiedBy: {
                userID: 'anikumar',
                fullName: 'Anil Kumar',
                email: 'anikumar@example.com',
                abbreviation: 'AKVD',
                departmentName: 'IT BPI Automation'
              },
              modifiedOn: '2020-10-05T09:24:15+02:00'
            }, {
              action: 'REMOVED',
              userModified: {
                userID: 'q04test',
                fullName: 'Q 04test',
                email: 'q04test@example.qas',
                abbreviation: 'Q04',
                departmentName: 'IT & BPI Automation'
              },
              modifiedBy: {
                userID: 'anikumar',
                fullName: 'Anil Kumar',
                email: 'anikumar@example.com',
                abbreviation: 'AKVD',
                departmentName: 'IT BPI Automation'
              },
              modifiedOn: '2020-10-05T09:24:15+02:00'
            }
          ]
        },
        allHistoryCount: 2
      });
    } else {
      return of({});
    }
  }
}

class ServiceParameterServiceMock {
  getServiceParameterPropertyValueByName(service: string, category?: string, parameter?: string, name?: string) {
    return 'test';
  }
}
