import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform, SimpleChange} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {MatMenuModule} from '@angular/material/menu';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {FilterBarSelectedOptionsContainerComponent} from './filter-bar-selected-options-container.component';
import {FormControlConfiguration} from '../../../models/mc-configuration.model';

describe('FilterBarSelectedOptionsContainerComponent', () => {
  let fixture: ComponentFixture<FilterBarSelectedOptionsContainerComponent>;
  let component: FilterBarSelectedOptionsContainerComponent;
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ReactiveFormsModule, BrowserModule, BrowserAnimationsModule, MatMenuModule],
      declarations: [FilterBarSelectedOptionsContainerComponent, AALDatePipeMock]
    }).compileComponents();
    fixture = TestBed.createComponent(FilterBarSelectedOptionsContainerComponent);
    component = fixture.componentInstance;
    component.currentFilterOptions = {
      PBSIDs: [{id: '123456',
        projectID: '12345-ProjectId',
        productID: 'productID-12345'}],
      PCCSTRAIMIDs: [],
      actionDates: [{  begin: new Date(),
        end: new Date()}],
      actionDisplayStatus: [{value: 'testName', label: 'testLabel'}],
      actionStatus: [{value: 'Namestring', label: 'labelString'}],
      actionType: [],
      activeDate: null,
      agendaCategory: 'online',
      allUsers: [],
      analysisPriority: [],
      attendee: [],
      classification: [],
      createdOn: {begin: new Date(), end: new Date()},
      customerImpact: [],
      decision: ['done', 'pending', 'success', 'close'],
      department: [],
      dueDate: null,
      effectiveEndDate: null,
      group: [
        {group: 'group name',
          name: 'name',
          user: {},
          role: 'cm-test-role',
          level: ['testString'],
          roles: ['stringValue']
        }],
      id: ['123456', '1234567'],
      implementationPriority: [],
      isActive: [],
      keywords: [],
      linkedChangeObject: '',
      linkedItems: null,
      meetingDate: null,
      people: [{
        role: {value: 'myTeam', label: 'In myTeam', sequence: '1'},
        user: {userID: 'usrerid', fullName: 'full name', abbreviation: 'VJ'},
        users: [{userID: 'usrerid', email: 'name.hai@example.com'}]}],
      plannedEffectiveDate: null,
      plannedReleaseDate: null,
      priority: [],
      productID: [],
      projectID: [{
        wbsElement: 'string',
        description: 'string'
      }],
      purpose: [],
      reviewItems: [],
      role: [],
      solutionItem: null,
      state: [],
      status: [],
      tags: [],
      type: []};
    component.showFilterContainer = true;
    fixture.detectChanges();
  }));

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should component members be initialized', () => {
    component.ngOnInit();
    expect(component.reviewItemsList).toEqual([]);
  });

  it('should emit selectedFilterRemoved when removeItem is called',  () => {
    spyOn(component.selectedFilterRemoved, 'emit');
    const item = { user : {userID: 'vjanapar'}, role : {name: 'myTeam'}};
    component.removeItem('people', item);
    expect(component.selectedFilterRemoved.emit).toHaveBeenCalled();
  });

  it('should set plannedReleaseDate to null when removeItem is triggered',  () => {
    const item = { user : {userID: 'vjanapar'}, role : {name: 'myTeam'}};
    component.removeItem('plannedReleaseDate', item);
    expect(component.currentFilterOptions['plannedReleaseDate']).toBe(null);
  });

  it('should set actionDates to null when removeItem is triggered',  () => {
    const item = { user : {userID: 'vjanapar'}, role : {name: 'myTeam'}, name: 'testName'};
    component.removeItem('actionDates', item);
    expect(component.currentFilterOptions['actionDates'].length).toBe(1);
  });

  it('should return nothing when calculateChipIndex is triggered',  () => {
    component.chipContainer = {
      _elementRef: {
        nativeElement: {
          parentElement: {
            parentElement: {
              offsetWidth: 100
            }
          },
          children: [{
            children: [{offsetWidth : 110}, {offsetWidth2 : 110}, {offsetWidth : 110}]
          }]
        }
      }
    };
    const returnValue = component.calculateChipIndex();
    expect(returnValue).toBe(undefined);
  });

  it('should return label from filterFormConfiguration when getFilterValueLabel is triggered', () => {
    component.filterFormConfiguration = {testString : {
        ID: '123456',
        placeholder: 'string',
        help: 'string',
        hint: 'string',
        prefix: 'tx',
        enumeration: [{name: 'testingName', label: 'labelName'}]
      } as FormControlConfiguration};
    const returnValue = component.getFilterValueLabel('testString', 'testingName');
    expect(returnValue).toBe('labelName');
  });

  it('should return value from filterFormConfiguration when getFilterValueLabel is triggered', () => {
    component.filterFormConfiguration = {testString : {
        ID: '123456',
        placeholder: 'string',
        help: 'string',
        hint: 'string',
        prefix: 'tx'} as FormControlConfiguration};
    const returnValue = component.getFilterValueLabel('testString', 'testingName');
    expect(returnValue).toBe('testingName');
  });

  it('should emit selectedAllFiltersRemoved when onClearAllFilters is triggered', () => {
    spyOn(component.selectedAllFiltersRemoved, 'emit');
    component.currentFilterOptions = {
      state: [],
      status: [],
      classification: [],
      productID: [],
      projectID: []};
    component.onClearAllFilters();
    expect(component.selectedAllFiltersRemoved.emit).toHaveBeenCalled();
  });

  it('should call createFilterOptionArray when onChange trigger', () => {
    spyOn(component, 'createFilterOptionArray');
    const simpleChange = {currentFilterOptions: new SimpleChange(null, {test: 'test'}, false)};
    component.ngOnChanges(simpleChange);
    expect(component.createFilterOptionArray).toHaveBeenCalled();
  });

  describe('objectKeys', () => {
    it('should return the keys (test-key1, test-key2) of the input object', () => {
      const testObj = {'test-key1': 'test-value1', 'test-key2': 'test-value2'};
      const keys = component.objectKeys(testObj);
      expect(keys.indexOf('test-key1')).toBeGreaterThan(-1);
    });

    it('should return empty of the input object', () => {
      const testObj = '';
      const keys = component.objectKeys(testObj);
      expect(keys.length).toBe(0);
    });
  });
});

@Pipe({name: 'aalDate'})
class AALDatePipeMock implements PipeTransform {
  transform(value) {
    return '12-12-2020';
  }
}
