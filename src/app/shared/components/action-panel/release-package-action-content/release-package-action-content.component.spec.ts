import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {RouterTestingModule} from '@angular/router/testing';
import {Router, RouterModule} from '@angular/router';
import {StoreModule} from '@ngrx/store';
import {of, throwError} from 'rxjs';
import createSpyObj = jasmine.createSpyObj;

import {ReleasePackageActionContentComponent} from './release-package-action-content.component';
import {ServiceParametersService} from '../../../../core/services/service-parameters.service';
import {metaReducers, reducers} from '../../../../store';
import {ReviewService} from '../../../../core/services/review.service';
import {ReviewSummaryNew} from '../../../models/mc-presentation.model';
import {UserProfileService} from '../../../../core/services/user-profile.service';

describe('ReleasePackageActionContentComponent', () => {
  let component: ReleasePackageActionContentComponent;
  let fixture: ComponentFixture<ReleasePackageActionContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ReleasePackageActionContentComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterModule, RouterTestingModule, HttpClientModule, MatDialogModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        {provide: ServiceParametersService, useClass: ServiceParametersServiceMock},
        {provide: ReviewService, useClass: ReviewServiceMock},
        {provide: UserProfileService, useClass: UserProfileServiceMock},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleasePackageActionContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set reviewOverlayData when getReviewersList is triggered', () => {
    event = createSpyObj('event', ['stopPropagation', 'stopPropagation']);
    const review = {
      id: 123456,
      title: 'string',
      completion_date: 'string',
      status: 123456,
      status_label: 'string',
      releasepackage_id: 'string',
      releasepackage_name: 'string',
      ecn_id: 'string',
      ecn_name: 'string',
      completed_review_task_count: 123456,
      review_task_count: 123456,
      completed_review_entry_count: 123456,
      review_entry_count: 1234656
    } as ReviewSummaryNew;
    component.getReviewersList(review);
    expect(component.reviewOverlayData.length).toBeGreaterThan(0);
  });

  it('should set reviewEntriesList when getDefectsList is triggered ', () => {
    event = createSpyObj('event', ['stopPropagation', 'stopPropagation']);
    const review = {
      id: 123456,
      title: 'string',
      completion_date: 'string',
      status: 123456,
      status_label: 'string',
      releasepackage_id: 'string',
      releasepackage_name: 'string',
      ecn_id: 'string',
      ecn_name: 'string',
      completed_review_task_count: 123456,
      review_task_count: 123456,
      completed_review_entry_count: 123456,
      review_entry_count: 1234656
    } as ReviewSummaryNew;
    component.getDefectsList(review);
    expect(component.reviewEntriesList.length).toBeGreaterThan(0);
  });

  it('should set reviewOverlayData when getReviewersList is triggered false', () => {
    event = createSpyObj('event', ['stopPropagation', 'stopPropagation']);
    const review = {
      id: 0,
      title: 'string',
      completion_date: 'string',
      status: 123456,
      status_label: 'string',
      releasepackage_id: 'string',
      releasepackage_name: 'string',
      ecn_id: 'string',
      ecn_name: 'string',
      completed_review_task_count: 123456,
      review_task_count: 123456,
      completed_review_entry_count: 123456,
      review_entry_count: 1234656
    } as ReviewSummaryNew;
    component.getReviewersList(review);
    expect(component.reviewOverlayData).toBe(undefined);
  });

  it('should set reviewEntriesList when getDefectsList is triggered false', () => {
    event = createSpyObj('event', ['stopPropagation', 'stopPropagation']);
    const review = {
      id: 0,
      title: 'string',
      completion_date: 'string',
      status: 123456,
      status_label: 'string',
      releasepackage_id: 'string',
      releasepackage_name: 'string',
      ecn_id: 'string',
      ecn_name: 'string',
      completed_review_task_count: 123456,
      review_task_count: 123456,
      completed_review_entry_count: 123456,
      review_entry_count: 1234656
    } as ReviewSummaryNew;
    component.getDefectsList(review);
    expect(component.reviewEntriesList).toBe(undefined);
  });

  it('should open new window when reviewersListItemClicked is triggered', () => {
    spyOn(window, 'open');
    const review = {
      id: 123456,
      title: 'string',
      completion_date: 'string',
      status: 123456,
      status_label: 'string',
      releasepackage_id: 'string',
      releasepackage_name: 'string',
      ecn_id: 'string',
      ecn_name: 'string',
      completed_review_task_count: 123456,
      review_task_count: 123456,
      completed_review_entry_count: 123456,
      review_entry_count: 1234656,
      assignee: 'test'
    };
    component.reviewersListItemClicked(review);
    expect(window.open).toHaveBeenCalledWith('/reviews/123456', '_blank');
  });

  it('should navigate when overlayCardSubmit is triggered', inject([Router], (router: Router) => {
    spyOn(router, 'navigate').and.stub();
    component.overlayCardSubmit({id: '123456'});
    expect(router.navigate).toHaveBeenCalledWith(['reviews/123456']);
  }));

  it('should open new window when defectsListItemClicked is triggered', () => {
    spyOn(window, 'open');
    component.defectsListItemClicked({id: '123456'});
    expect(window.open).toHaveBeenCalledWith('/reviews/123456', '_blank');
  });

});

class ServiceParametersServiceMock {
  getCaseObjectMetaData(service: string, category: string) {
    return {};
  }

  getServiceParameter() {
    return [{'name': 'name1'}];
  }
}

class ReviewServiceMock {
  getReviewersActionDetails$(reviewID) {
    if (reviewID === 123456) {
      return of({review_task_summaries: [{test: '1234'}, {test: '2345'}]});
    } else {
      return throwError(new Error('err!'));
    }
  }

  getReviewEntries(reviewID) {
    if (reviewID === 123456) {
      return of({results: [{test: '1234'}, {test: '2345'}]});
    } else {
      return throwError(new Error('err!'));
    }
  }
}

class UserProfileServiceMock {
  getUserProfile() {
    return {user: {state: {}}};
  }

  getState() {
    return {reviewEntryState: {commonCaseObjectState: {filters: {filtersModel: {currentDefaultFilter: {people: {}}}}}}};
  }

  updateUserProfileStates(mcState) {
    return {};
  }
}
