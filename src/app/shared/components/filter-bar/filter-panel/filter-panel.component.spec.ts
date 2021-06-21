import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {MatMenuModule} from '@angular/material/menu';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import createSpyObj = jasmine.createSpyObj;

import {FilterPanelComponent} from './filter-panel.component';
import {ServiceParametersService} from '../../../../core/services/service-parameters.service';
import {FilterBarService} from '../filter-bar.service';
import {metaReducers, reducers} from '../../../../store';
import {UserProfileService} from '../../../../core/services/user-profile.service';
import {HelpersService} from '../../../../core/utilities/helpers.service';
import {HistoryService} from '../../../../core/services/history.service';


describe('FilterPanelComponent', () => {
  let fixture: ComponentFixture<FilterPanelComponent>;
  let component: FilterPanelComponent;
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        BrowserModule,
        MatMenuModule,
        MatAutocompleteModule,
        HttpClientModule,
        StoreModule.forRoot(reducers, {metaReducers})],
      declarations: [FilterPanelComponent],
      providers: [
        {provide: ServiceParametersService, useClass: ServiceParametersServiceMock},
        {provide: UserProfileService, useClass: UserProfileServiceMock},
        {provide: HelpersService, useClass: HelpersServiceMock},
        {provide: HistoryService, useClass: HistoryServiceMock},
        FilterBarService
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(FilterPanelComponent);
    component = fixture.componentInstance;
    component['caseObject'] = 'ChangeRequest';
    component['dateControl'] = new FormControl();
    component.filtersHistoryFormGroup = new FormGroup({
      PCCSTRAIMIDs: new FormControl([]),
      PBSIDs: new FormControl([]),
      productID: new FormControl([]),
      projectID: new FormControl([]),
      role: new FormControl([]),
      user: new FormControl([]),
      group: new FormControl([])
    });
    component.filtersHistoryFormGroup.setValue(
      {
        productID: '1234',
        projectID: '1111',
        PCCSTRAIMIDs: [],
        PBSIDs: [],
        role: new FormControl([]),
        user: new FormControl([]),
        group: new FormControl([])
      });
    fixture.detectChanges();
  }));

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit filterPanelAccepted when applyFilter is triggered',  () => {
    spyOn(component.filterPanelAccepted, 'emit');
    component.caseObjectCurrentFilterFormGroup = new FormGroup({
      type: new FormControl('')
    });
    component.caseObjectCurrentFilterFormGroup.setValue({type: {test: 'test'}});
    component.applyFilter();
    expect(component.filterPanelAccepted.emit).toHaveBeenCalled();
  });

  it('should emit filterPanelOptionsRemoved when optionRemoved is triggered',  () => {
    spyOn(component.filterPanelOptionsRemoved, 'emit');
    component.optionRemoved({});
    expect(component.filterPanelOptionsRemoved.emit).toHaveBeenCalled();
  });

  it('should emit filterPanelCancelled when cancelFilter is triggered', () => {
    spyOn(component.filterPanelCancelled, 'emit');
    component.cancelFilter();
    expect(component.filterPanelCancelled.emit).toHaveBeenCalled();
  });

  it('should emit filterPanelCancelled when escape event is fire',  () => {
    spyOn(component.filterPanelCancelled, 'emit');
    const event = new KeyboardEvent('keydown', {
      key: 'Escape'
    });
    document.dispatchEvent(event);
    expect(component.filterPanelCancelled.emit).toHaveBeenCalled();
  });

  it('should set value to filtersHistoryFormGroup when ngOnInit is initialized ',  () => {
    component.filtersHistoryFormGroup = createSpyObj({productID: '1234', projectID: '1111', PCCSTRAIMIDs: [], PBSIDs: [], role: [], user: [], group: []});
    component.ngOnInit();
    component.filtersHistoryFormGroup.setValue({productID: '5678', projectID: '1111', PCCSTRAIMIDs: [], PBSIDs: [], role: [], user: [], group: []});
    fixture.detectChanges();
    expect(component.filtersHistoryFormGroup.value).toEqual({productID: '5678', projectID: '1111', PCCSTRAIMIDs: [], PBSIDs: [], role: [], user: [], group: []});
  });
});

class ServiceParametersServiceMock {
  getCaseObjectMetaData(service: string, category: string) {
    return {filter: {role: {options: [{value: 'myTeam', label: 'In myTeam'},
            {value: 'myTeam1', label: 'In myTeam2'}]}, otherRoles: {}, help: {help: 'test help'},
        generalInformation: {status: {options: [{value: 'myTeam', label: 'In myTeam'},
              {value: 'myTeam1', label: 'In myTeam2'}]}}}};
  }
}
class  UserProfileServiceMock {
  getCaseObjectState() {
    return {
      commonCaseObjectState : {
        listSortConfiguration : {
          active: 'id',
          'direction': 'asc'
        },
        listOverviewSortConfiguration : {
          'active': 'createdOn',
          'direction': 'desc'
        },
        'filters': {
          'filtersModel': {
            'currentDefaultFilter': {
              'state': [], 'status': [], 'implementationPriority': [], 'analysisPriority': [],
              'customerImpact': [], 'PCCSTRAIMIDs': [], 'PBSIDs': [], 'type': [], 'purpose': [], 'productID': [],
              'projectID': [], 'people': [], 'attendee': [], 'allUsers': [], 'plannedReleaseDate': null,
              'plannedEffectiveDate': null, 'dueDate': null, 'meetingDate': null, 'linkedItems': '',
              'reviewItems': [], 'classification': [], 'decision': [], 'keywords': [], 'role': [],
              'group': [], 'assigneeGroup': [], 'department': [], 'activeDate': null, 'priority': [],
              'effectiveEndDate': null, 'createdOn': null, 'isActive': [], 'id': [], 'actionType': [],
              'linkedChangeObject': '', 'agendaCategory': '', 'actionDates': [], 'actionStatus': [], 'actionDisplayStatus': [], 'tags': [], 'fromCaseObject': ''
            }, 'AIRPBS': {
              'PCCSTRAIMIDs': [{'number': 'P125605'}],
              'PBSIDs': [{'ID': '19034'}],
              'people': [{'role': {'name': 'myTeam', 'label': 'In myTeam', 'sequence': '1'}}]}}
        },
        'filterHistory': {'productID': [], 'projectID': [], 'PCCSTRAIMIDs': [], 'PBSIDs': [], 'user': [], 'role': [], 'group': []},
        'stateConfiguration': {'panelState': 'CREATE', 'listView': true},
        'sidePanelNotesToggleOption': 'CASEOBJECT'},
      'imsPageState': {}, 'detailsPageState': {}
    };
  }

  updateCaseObjectState(caseObjectState, caseObject) {
    return {};
  }
}

class HelpersServiceMock {
  getCaseObjectForms(caseObject) {
    return {caseObject: {}};
  }
}

class HistoryServiceMock {
  createHistoryFormGroup(historyModel) {
    return new FormBuilder().group({
      PCCSTRAIMIDs: [],
      PBSIDs: [],
      productID: [],
      projectID: [],
      role: [],
      user: [],
      group: []
    });
  }
}
