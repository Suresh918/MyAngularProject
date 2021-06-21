import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {of} from 'rxjs';

import { ActionPanelComponent } from './action-panel.component';
import {CaseObjectListService} from '../../../core/services/case-object-list.service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {CaseObjectOverview} from '../case-object-list/case-object-list.model';
import {ReviewService} from '../../../core/services/review.service';


describe('ActionPanelComponent', () => {
  let component: ActionPanelComponent;
  let fixture: ComponentFixture<ActionPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ActionPanelComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule],
      providers: [
        { provide: CaseObjectListService, useClass: CaseObjectListServiceMock },
        { provide: HelpersService, useClass: HelpersServiceMock },
        { provide: ReviewService, useClass: ReviewServiceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set getActionList with filter either expiry soon or late when service call return response and should also have value for restrictCCBActions ',  () => {
    const caseObject = {ID: '12345'};
    component.agendaId = '12345';
    component.caseObjectRevision = 'AA';
    component.caseObjectType = 'ChangeRequest';
    component.restrictCCBActions = 'test';
    component.getActionList(caseObject);
    expect(component.actionOverViewList).toEqual([{expiry: 'Soon'}, {expiry: 'Late'}]);
  });

  it('should set getActionList with filter either expiry soon or late when service call return response and should not set value for restrictCCBActions ',  () => {
    const caseObject = {ID: '12345'};
    component.agendaId = '12345';
    component.caseObjectRevision = 'AA';
    component.caseObjectType = 'ChangeRequest';
    component.getActionList(caseObject);
    expect(component.actionOverViewList.length).toBeGreaterThan(0);
  });

  it('should return days  from helper method getEnDateDaysLeft', () => {
    const date = new Date();
    const returnValue = component.getEnDateDaysLeft(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 5));
    expect(returnValue).toBeGreaterThan(0);
  });

  it('should return true from helper method for isPastDate', () => {
    const date = new Date();
    const returnValue = component.isEnDateGreater(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 5));
    expect(returnValue).toBe(true);
  });

  it('should set review when  getReviewByReleasePackageID is triggered',  () => {
    component.caseObject = {ID: '123456', title: 'name'} as CaseObjectOverview;
    component.getReviewByReleasePackageID();
    expect(component.review).toEqual({ id: 12345,
    title: 'revew title',
    completion_date: 'new Date()',
    status: 1,
    status_label: '',
    releasepackage_id: '123456',
    releasepackage_name: 'testName',
    ecn_id: '123456',
    ecn_name: 'testName',
    completed_review_task_count: 10,
    review_task_count: 11,
    completed_review_entry_count: 10,
    review_entry_count: 10,
    teamcenter_id: '123456'});
  });
});

class CaseObjectListServiceMock {
  getCaseObjectActionSummaries$(caseObjectID, caseObjectRevision, caseObjectType, filter, OrderBy) {
    return of([{expiry: 'Soon'}, {expiry: 'Late'}, {expiry: 'Soon-Late'}]);
  }
}

class HelpersServiceMock {
  getDaysLeftFromNow(actionDeadline) {
    return 12345;
  }
  isPastDate(actionDeadline) {
    return true;
  }
}

class ReviewServiceMock {
  ReviewSummaryList(start, end, filterQuery, sortBy) {
    return of({results: [{ id: 12345,
        title: 'revew title',
        completion_date: 'new Date()',
        status: 1,
        status_label: '',
        releasepackage_id: '123456',
        releasepackage_name: 'testName',
        ecn_id: '123456',
        ecn_name: 'testName',
        completed_review_task_count: 10,
        review_task_count: 11,
        completed_review_entry_count: 10,
        review_entry_count: 10,
        teamcenter_id: '123456'}]});
  }
}
