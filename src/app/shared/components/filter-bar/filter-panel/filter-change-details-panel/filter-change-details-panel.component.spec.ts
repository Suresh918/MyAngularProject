import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MatChipsModule} from '@angular/material/chips';
import {FormControl, FormGroup} from '@angular/forms';

import {FilterChangeDetailsPanelComponent} from './filter-change-details-panel.component';
import {MCAutoCompleteGroupMultipleComponent} from '../../../mc-auto-complete-group-multiple/mc-auto-complete-group-multiple.component';
import {MCAutoCompleteProjectMultipleComponent} from '../../../mc-auto-complete-project-multiple/mc-auto-complete-project-multiple.component';
import {MCAutoCompleteProductMultipleComponent} from '../../../mc-auto-complete-product-multiple/mc-auto-complete-product-multiple.component';
import {MCAutoCompleteAirMultipleComponent} from '../../../mc-auto-complete-air-multiple/mc-auto-complete-air-multiple.component';
import {MCAutoCompletePbsMultipleComponent} from '../../../mc-auto-complete-pbs-multiple/mc-auto-complete-pbs-multiple.component';
import {MCSelectMultipleComponent} from '../../../mc-select-multiple/mc-select-multiple.component';
import {MCSelectSingleComponent} from '../../../mc-select-single/mc-select-single.component';
import {MatInputTextMultiChipComponent} from '../../../mat-input-text-multi-chip/mat-input-text-multi-chip.component';

describe('FilterChangeDetailsPanelComponent', () => {
  let component: FilterChangeDetailsPanelComponent;
  let fixture: ComponentFixture<FilterChangeDetailsPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FilterChangeDetailsPanelComponent,
        MCAutoCompleteGroupMultipleComponent,
        MCAutoCompleteProjectMultipleComponent,
        MCAutoCompleteProductMultipleComponent,
        MCAutoCompleteAirMultipleComponent,
        MCAutoCompletePbsMultipleComponent,
        MCSelectMultipleComponent,
        MCSelectSingleComponent,
        MatInputTextMultiChipComponent],
      imports: [AALAutoCompleteMultipleModule, AALSelectSingleModule, MatChipsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterChangeDetailsPanelComponent);
    component = fixture.componentInstance;
    component.caseObjectCurrentFilterFormGroup = new FormGroup({
      type: new FormControl([]),
      linkedChangeObject: new FormControl({}),
      PCCSTRAIMIDs: new FormControl([]),
      PBSIDs: new FormControl([]),
      changeObject: new FormControl('')
    });
    component.caseObjectCurrentFilterFormGroup.patchValue({PCCSTRAIMIDs: ['123456', '234567', '234444'], PBSIDs: ['122333', '34567', '33333']});
    component.caseObjectCurrentFilterFormGroup.patchValue({type: [{name: 'ANNOUNCEMENT'}]});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call checkForNotificationTypeChanges when handleLinkedObjectState is triggered', () => {
    spyOn(component, 'checkForNotificationTypeChanges');
    component.handleLinkedObjectState([{name: 'Performance'}]);
    expect(component.checkForNotificationTypeChanges).toHaveBeenCalled();
  });

  it('should status disable for linkedChangeObject when checkForNotificationTypeChanges is triggered', function () {
    component.caseObjectCurrentFilterFormGroup.patchValue({type: [{name: 'ANNOUNCEMENT'}]});
    component.checkForNotificationTypeChanges();
    expect(component.caseObjectCurrentFilterFormGroup.get('linkedChangeObject').status).toBe('DISABLED');
  });

  it('should status VALID for linkedChangeObject when checkForNotificationTypeChanges is triggered', function () {
    component.caseObjectCurrentFilterFormGroup.patchValue({type: [{name: 'PERFORMANCE'}]});
    component.checkForNotificationTypeChanges();
    expect(component.caseObjectCurrentFilterFormGroup.get('linkedChangeObject').status).toBe('VALID');
  });
});
