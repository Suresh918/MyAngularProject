import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, SimpleChange} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';

import {FilterUrgencyPanelComponent} from './filter-urgency-panel.component';
import {MatDatePickerCustomizedComponent} from '../../../mat-date-picker-customized/mat-date-picker-customized.component';
import {MCSelectMultipleComponent} from '../../../mc-select-multiple/mc-select-multiple.component';

describe('FilterUrgencyPanelComponent', () => {
  let component: FilterUrgencyPanelComponent;
  let fixture: ComponentFixture<FilterUrgencyPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterUrgencyPanelComponent, MatDatePickerCustomizedComponent, MCSelectMultipleComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [AALSelectMultipleModule, FormsModule, ReactiveFormsModule, MatDatepickerModule ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterUrgencyPanelComponent);
    component = fixture.componentInstance;
    component.caseObjectCurrentFilterFormGroup = new FormGroup({
      plannedEffectiveDate: new FormControl({plannedEffectiveDate: {begin: '2020-07-28T12:00:00.000Z',
          end: '2020-08-25T12:00:00.000Z'}}),
      actionDisplayStatus: new FormControl([{name: 'Late'}, {name: 'Soon'}, {name: 'Open'}, {name: 'Accepted'}]),
      actionStatus: new FormControl(),
      actionDates: new FormControl()
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set value to actionDatesFormControl on initialization', () => {
    component.ngOnInit();
    expect(component.actionDatesFormControl.value).toEqual([{name: 'Late'}, {name: 'Soon'}, {name: 'Open'}, {name: 'Accepted'}]);
  });

  it('should greater then zero for actionDatesFormControl onChanges',  () => {
    const simpleChange = {caseObjectCurrentFilterFormGroup: new SimpleChange(null, {plannedEffectiveDate: {begin: '2020-07-28T12:00:00.000Z',
            end: '2020-08-25T12:00:00.000Z'}, actionDisplayStatus: [{test: 'test'}]}
        , false)};
    component.ngOnChanges(simpleChange);
    expect(component.actionDatesFormControl.value.length).toBeGreaterThan(0);
  });

  it('should be actionDates empty for caseObjectCurrentFilterFormGroup when setDueDateFiltersForActions is triggered',  () => {
    component.selectedDatesArray = [{begin: new Date('7/27/2020'), end: new Date('7/27/2020')}];
    const actionDateList = [];
    component.setDueDateFiltersForActions(actionDateList);
    expect(component.caseObjectCurrentFilterFormGroup.get('actionDates').value.length).toBe(0);
  });

});
