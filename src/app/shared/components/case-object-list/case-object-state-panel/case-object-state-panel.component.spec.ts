import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform, SimpleChange} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatTooltipModule} from '@angular/material/tooltip';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {StoreModule} from '@ngrx/store';
import {of} from 'rxjs';

import {CaseObjectLabelPipe} from '../../../pipes/case-object-label.pipe';
import {CaseObjectStatePanelComponent} from './case-object-state-panel.component';
import {CaseObjectActionStatusCardComponent} from './case-object-action-status-card/case-object-action-status-card.component';
import {CaseObjectStatusCardComponent} from './case-object-status-card/case-object-status-card.component';
import {metaReducers, reducers} from '../../../../store';
import {HelpersService} from '../../../../core/utilities/helpers.service';
import {UserProfileService} from '../../../../core/services/user-profile.service';
import {ServiceParametersService} from '../../../../core/services/service-parameters.service';
import {CaseObjectStateAnalytics} from '../case-object-list.model';
import {CaseObjectState} from '../../../models/mc-states-model';


describe('CaseObjectStatePanelComponent', () => {
  let component: CaseObjectStatePanelComponent;
  let fixture: ComponentFixture<CaseObjectStatePanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CaseObjectStatePanelComponent, CaseObjectLabelPipeMock, CaseObjectStatusCardComponent, CaseObjectActionStatusCardComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FlexLayoutModule, MatTooltipModule, HttpClientModule, MatDialogModule,
        StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        {provide: CaseObjectLabelPipe, useClass: CaseObjectLabelPipeMock},
        {provide: HelpersService, useClass: HelpersServiceMock},
        {provide: UserProfileService, useClass: UserProfileServiceMock},
        {provide: ServiceParametersService, useClass: ServiceParametersServiceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseObjectStatePanelComponent);
    component = fixture.componentInstance;
    component.caseObjectType = 'agenda';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set value to filterQuery when ngOnChanges is triggered', () => {
    component.ngOnChanges({'filterQuery': new SimpleChange(null, '400144-06', false)});
    expect(component.filterQuery).toBe('400144-06');
  });

  it('should emit obsoletedCardsCountChange when onStatusCardSelection is triggered', () => {
    spyOn(component.obsoletedCardsCountChange, 'emit');
    const cardDetails = {caseObjectState: true, caseObjectStatus: ''};
    component.selectedCardIndex = 1;
    component.onStatusCardSelection(cardDetails, 1);
    expect(component.obsoletedCardsCountChange.emit).toHaveBeenCalled();
  });

  it('should return toolTip when caseObjectType is agenda and caseObjectStatus is UNASSIGNED',  () => {
    const stateCard = {caseObjectStatus: 'UNASSIGNED', caseObjectState: ''};
    component.expandStatePanel = true;
    const returnValue = component.getToolTip(stateCard);
    expect(returnValue).toBe('Not Linked to Outlook Meeting Yet');
  });

  it('should return toolTip when caseObjectType is agenda and caseObjectStatus is COMMUNICATED',  () => {
    const stateCard = {caseObjectStatus: 'COMMUNICATED', caseObjectState: ''};
    const returnValue = component.getToolTip(stateCard);
    expect(returnValue).toBe('Agendas Update Sent To Invitees');
  });

  it('should return toolTip when caseObjectType is agenda and caseObjectStatus is ASSIGNED',  () => {
    const stateCard = {caseObjectStatus: 'ASSIGNED', caseObjectState: ''};
    const returnValue = component.getToolTip(stateCard);
    expect(returnValue).toBe('Linked to Outlook Meeting');
  });

  it('should return toolTip when caseObjectType is agenda and caseObjectStatus is PREPARE-MINUTES',  () => {
    const stateCard = {caseObjectStatus: 'PREPARE-MINUTES', caseObjectState: ''};
    const returnValue = component.getToolTip(stateCard);
    expect(returnValue).toBe('During / Right After Meeting');
  });

  it('should return toolTip when caseObjectType is agenda and caseObjectStatus is COMPLETED',  () => {
    const stateCard = {caseObjectStatus: 'COMPLETED', caseObjectState: ''};
    const returnValue = component.getToolTip(stateCard);
    expect(returnValue).toBe('Minutes Were Sent');
  });

  it('should return undefined when caseObjectType is agenda and caseObjectStatus is not match',  () => {
    const stateCard = {caseObjectStatus: '', caseObjectState: ''};
    const returnValue = component.getToolTip(stateCard);
    expect(returnValue).toBe('');
  });

  it('should return state panel label when expandStatePanel & plannedEffectiveDateDueSoonCount is not set on triggered getToolTip',  () => {
    const stateCard = {
      openActionsCount: '12',
      caseObjectState : '',
      overdueActionsCount: '4',
      plannedReleaseDateDueSoonCount : 'test',
      dueSoonActionsCount: '3',
      plannedEffectiveDateDueSoonCount: undefined};
    component.caseObjectType = '';
    const returnValue = component.getToolTip(stateCard);
    expect(returnValue).toBe('Actions: 12 · Soon: 4 · Late: 3');
  });

  it('should return state panel label when expandStatePanel is not set, caseObjectStatus is NEW and plannedEffectiveDateDueSoonCount is set  on triggered getToolTip',  () => {
    const stateCard = {
      openActionsCount: '12',
      caseObjectState : '',
      overdueActionsCount: '3',
      plannedReleaseDateDueSoonCount : '13',
      dueSoonActionsCount: '4',
      plannedEffectiveDateDueSoonCount: '12',
      caseObjectStatus: 'NEW'};
    component.caseObjectType = '';
    const returnValue = component.getToolTip(stateCard);
    expect(returnValue).toBe('Actions: 12 · PRD Soon: 13 · PED Soon: 12');
  });

  it('should return state panel label when expandStatePanel is not set, ' +
    'caseObjectStatus is READY-FOR-RELEASE and plannedEffectiveDateDueSoonCount is set  on triggered getToolTip',  () => {
    const stateCard = {
      openActionsCount: '12',
      caseObjectState : '',
      overdueActionsCount: '3',
      plannedReleaseDateDueSoonCount : '20',
      dueSoonActionsCount: '4',
      plannedEffectiveDateDueSoonCount: '12',
      plannedReleaseDateOverdueCount: '2',
      caseObjectStatus: 'READY-FOR-RELEASE'};
    component.caseObjectType = '';
    const returnValue = component.getToolTip(stateCard);
    expect(returnValue).toBe('Actions: 12 · PRD Soon: 20 · PRD Late: 2');
  });

  it('should return state panel label when expandStatePanel is not set, caseObjectStatus is RELEASED and plannedEffectiveDateDueSoonCount is set  on triggered getToolTip',  () => {
    const stateCard = {
      openActionsCount: '12',
      caseObjectState : '',
      overdueActionsCount: '3',
      plannedReleaseDateDueSoonCount : '19',
      dueSoonActionsCount: '4',
      plannedEffectiveDateDueSoonCount: '12',
      plannedEffectiveDateOverdueCount: '11',
      caseObjectStatus: 'RELEASED'};
    component.caseObjectType = '';
    const returnValue = component.getToolTip(stateCard);
    expect(returnValue).toBe('Actions: 12 · PRD Soon: 0 · PRD Late: 11');
  });

  it('should return state panel label when expandStatePanel is not set, caseObjectStatus is CLOSED and plannedEffectiveDateDueSoonCount is set  on triggered getToolTip',  () => {
    const stateCard = {
      openActionsCount: '12',
      caseObjectState : '',
      overdueActionsCount: '3',
      plannedReleaseDateDueSoonCount : '16',
      dueSoonActionsCount: '4',
      plannedEffectiveDateDueSoonCount: '12',
      caseObjectStatus: 'CLOSED'};
    component.caseObjectType = '';
    const returnValue = component.getToolTip(stateCard);
    expect(returnValue).toBe('Actions: 12 ');
  });

  it('should set selectedCardIndex when current case object and panel selected match', () => {
    component.currentStateModel = {commonCaseObjectState: {stateConfiguration: {panelState: 'CLOSED'}}} as CaseObjectState;
    component.stateCardList = [{caseObjectState: 'CLOSED'} as CaseObjectStateAnalytics, {caseObjectState: 'RELEASED'} as CaseObjectStateAnalytics];
    component.setActivePanelsSelection();
    expect(component.selectedCardIndex).toBe(0);
  });
});

@Pipe({name: 'caseObjectLabel'})
class CaseObjectLabelPipeMock implements PipeTransform {
  transform(value: any, ...args): string {
    return 'label';
  }
}
class ServiceParametersServiceMock {
  getCaseObjectMetaData() {
    return of({generalInformation: {
        status: {
          options: []
        }
      }});
  }
}

class HelpersServiceMock {
  getCaseObjectForms(type: string) {
    return {};
  }
}
class UserProfileServiceMock {
  getUserProfile() {
    return {user: {state: {}}};
  }
  getState() {
    return {};
  }
  updateCaseObjectState(currentStateModel, filterCaseObject, userProfileUpdatedState$) {
    return of ({});
  }

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
              'state': [], 'status': [], 'implementationPriority': [], 'analysisPriority': [], 'customerImpact': [], 'PCCSTRAIMIDs': [], 'PBSIDs': [],
              'type': [], 'purpose': [], 'productID': [], 'projectID': [], 'people': [], 'attendee': [], 'allUsers': [], 'plannedReleaseDate': null,
              'plannedEffectiveDate': null, 'dueDate': null, 'meetingDate': null, 'linkedItems': '', 'reviewItems': [], 'classification': [],
              'decision': [], 'keywords': [], 'role': [], 'group': [],
              'assigneeGroup': [], 'department': [], 'activeDate': null, 'priority': [], 'effectiveEndDate': null,
              'createdOn': null, 'isActive': [], 'id': [], 'actionType': [], 'linkedChangeObject': '',
              'agendaCategory': '', 'actionDates': [], 'actionStatus': [], 'actionDisplayStatus': [], 'tags': [], 'fromCaseObject': ''
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
}
class CaseObjectListServiceMock {
  getCaseObjectStatusCardDetails(caseObjectRouterPath, value, type, filterQuery, orderBy) {
    return of([{caseObjectState: 'CREATE',
      caseObjectsCount: 5350,
      dueSoonActionsCount: 1,
      obsoletedCaseObjectsCount: 170,
      openActionsCount: 4,
      overdueActionsCount: 62},
      {caseObjectState: 'DEFINE-SOLUTIO',
        caseObjectsCount: 5350,
        dueSoonActionsCount: 1,
        obsoletedCaseObjectsCount: 170,
        openActionsCount: 4,
        overdueActionsCount: 62},
      {caseObjectState: 'CLOSE',
        caseObjectsCount: 5350,
        dueSoonActionsCount: 1,
        obsoletedCaseObjectsCount: 170,
        openActionsCount: 4,
        overdueActionsCount: 62}]);
  }
}
