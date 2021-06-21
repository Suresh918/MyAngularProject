import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormArray, FormControl, FormGroup} from '@angular/forms';

import {FilterPeoplePanelComponent} from './filter-people-panel.component';
import {MCAutoCompleteUserSingleComponent} from '../../../mc-auto-complete-user-single/mc-auto-complete-user-single.component';
import {MCSelectSingleComponent} from '../../../mc-select-single/mc-select-single.component';
import {FilterBarService} from '../../filter-bar.service';
import {ServiceParametersService} from '../../../../../core/services/service-parameters.service';
import {metaReducers, reducers} from '../../../../../store';

describe('FilterPeoplePanelComponent', () => {
  let component: FilterPeoplePanelComponent;
  let fixture: ComponentFixture<FilterPeoplePanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FilterPeoplePanelComponent,
        MCAutoCompleteUserSingleComponent,
        MCSelectSingleComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [AALAutoCompleteSingleModule, AALSelectSingleModule, HttpClientModule, StoreModule.forRoot(reducers, {metaReducers}), BrowserAnimationsModule],
      providers: [
        {provide: FilterBarService, useClass: FilterBarServiceMock},
        {provide: ServiceParametersService, useClass: ServiceParametersServiceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterPeoplePanelComponent);
    component = fixture.componentInstance;
    component.caseObjectFilterConfiguration = {};
    component.caseObject = 'notification';
    component.filterFormConfiguration = {role: {}, otherRoles: {}};
    component.filterFormConfiguration.role['options'] = [{value: 'myTeam', label: 'In myTeam'},
      {value: 'myTeam1', label: 'In myTeam2'}];
    component.filterFormConfiguration.otherRoles['options'] = [{value: 'myTeamOther', label: 'In myTeam Other'},
      {value: 'myTeam1 Other', label: 'In myTeam2 Other'}];
    fixture.detectChanges();
  });

  it('should create', () => {
    component.filterFormConfiguration.role['enumeration'] = [{ ID: 'filter.role',
      options: [{value: 'myTeam', label: 'In myTeam'}],
      label: 'Is Role',
      placeholder: 'Select the role(s)'}];
    component.formArray = new FormArray([
      new FormGroup({
        role: new FormControl({value: 'role', name: 'allUsers'}, [])
      })
    ]);
    component.userRolesControlGroupConfiguration.options = [{value: 'myTeam', label: 'string', sequence: 123, section: 'sectionString'}];

    expect(component).toBeTruthy();
  });

  it('should set formArray control when setRolesForNonCaseObjects is triggered', () => {
    component.formArray = new FormArray([
      new FormGroup({
        role: new FormControl({value: 'role', name: 'allUsers'}, [])
      })
    ]);
    component.caseObject = 'agenda';
    component.setRolesForNonCaseObjects();
    expect(component.formArray.value.length).toBeGreaterThan(0);
    component.caseObject = 'decisionLog';
    component.setRolesForNonCaseObjects();
    expect(component.formArray.value.length).toBeGreaterThan(0);
    component.caseObject = 'readNotification';
    component.setRolesForNonCaseObjects();
    expect(component.formArray.value.length).toBeGreaterThan(0);
    component.caseObject = 'announcement';
    component.setRolesForNonCaseObjects();
    expect(component.formArray.value.length).toBeGreaterThan(0);
  });

  it('should set role when convertAllUsersToMyTeam is triggered ',  () => {
    component.formArray = new FormArray([new FormGroup({
      role: new FormControl({value: 'role', name: 'allUsers'}, [])
    })]);
    component.userRolesControlGroupConfiguration.options = [{value: 'myTeam', label: 'string', sequence: 123, section: 'sectionString'}];
    component.convertAllUsersToMyTeam();
    expect(component.formArray.length).toBe(1);
  });

  it('should remove value from formArray when removePeople is triggered',  () => {
    component.formArray = new FormArray([new FormGroup({
      role: new FormControl({value: 'role', name: 'allUsers'}, [])
    })]);
    component.removePeople(0);
    expect(component.formArray.length).toBe(0);
  });
});

class FilterBarServiceMock {
  createPeopleFormGroup() {
    return {test: 'test'};
  }
}

class ServiceParametersServiceMock {
  getCaseObjectMetaData(service: string, category: string) {
    return {};
  }
}
