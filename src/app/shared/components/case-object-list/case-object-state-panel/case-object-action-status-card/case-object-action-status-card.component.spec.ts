import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {StoreModule} from '@ngrx/store';

import { CaseObjectActionStatusCardComponent } from './case-object-action-status-card.component';
import {metaReducers, reducers} from '../../../../../store';


describe('CaseObjectActionStatusCardComponent', () => {
  let component: CaseObjectActionStatusCardComponent;
  let fixture: ComponentFixture<CaseObjectActionStatusCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseObjectActionStatusCardComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatTooltipModule, StoreModule.forRoot(reducers, {metaReducers})]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseObjectActionStatusCardComponent);
    component = fixture.componentInstance;
    component.caseObjectDetails = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return string when getActiveStatusCard triggered with actionTYpe and isActive true', () => {
    expect(component.getActiveStatusCard('ACCEPTED-AND-LATE', true)).toBe('action-status--card-active-Accepted-late');
    expect(component.getActiveStatusCard('ACCEPTED-AND-DUE-SOON', true)).toBe('action-status--card-active-Accepted-due-soon');
    expect(component.getActiveStatusCard('ACCEPTED', true)).toBe('action-status--card-active-accepted');
    expect(component.getActiveStatusCard('OPEN', true)).toBe('action-status--card-active-open');
    expect(component.getActiveStatusCard('DETAILS-REQUESTED', true)).toBe('action-status--card-active-Details-Requested');
    expect(component.getActiveStatusCard('', true)).toBe('');
  });
  it('should return string when getActiveStatusCard triggered with actionTYpe and isActive false', () => {
    expect(component.getActiveStatusCard('ACCEPTED-AND-LATE', false)).toBe('action-status--card-Accepted-late');
    expect(component.getActiveStatusCard('ACCEPTED-AND-DUE-SOON', false)).toBe('action-status--card-Accepted-due-soon');
    expect(component.getActiveStatusCard('ACCEPTED', false)).toBe('action-status--card-accepted');
    expect(component.getActiveStatusCard('OPEN', false)).toBe('action-status--card-open');
    expect(component.getActiveStatusCard('DETAILS-REQUESTED', false)).toBe('action-status--card-Details-Requested');
    expect(component.getActiveStatusCard('', false)).toBe('');
  });
  it('should return string when getActionsToolTip  is triggered with actionType',  () => {
    expect(component.getActionsToolTip('ACCEPTED-AND-LATE')).toBe('Show \'Late\' only');
    expect(component.getActionsToolTip('ACCEPTED-AND-DUE-SOON')).toBe('Actions Due In 7 Days');
    expect(component.getActionsToolTip('ACCEPTED')).toBe('Show \'Accepted\' only (due in 7+ days)');
    expect(component.getActionsToolTip('OPEN')).toBe('Show \'Open\' only (due in more than 7 days)');
    expect(component.getActionsToolTip('DETAILS-REQUESTED')).toBe('Actions for which details requested');
    expect(component.getActionsToolTip('')).toBe('');
  });
});
