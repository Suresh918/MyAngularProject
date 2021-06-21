import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, SimpleChange} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {StoreModule} from '@ngrx/store';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {of, Subscription, throwError} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';

import {McExpansionPanelListAirComponent} from './mc-expansion-panel-list-air.component';
import {metaReducers, reducers} from '../../../store';
import {Value} from '../../models/service-parameters.model';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';
import {ChangeRequestService} from '../../../change-request/change-request.service';
import {AgendaItemService} from '../../../core/services/agenda-item.service';
import {Problem} from '../../models/air.model';
import {ChangeRequestServiceMock} from '../../../change-request/creator/creator-change-request-details/creator-change-request-mock.service';

describe('MCExpansionPanelListAirComponent', () => {
  let component: McExpansionPanelListAirComponent;
  let fixture: ComponentFixture<McExpansionPanelListAirComponent>;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of({errorInServiceCall: {}}), close: null });
  const dialogRefSpyObj1 = jasmine.createSpyObj({ afterClosed : of([{errorInServiceCall: {}}]), close: null });
  const dialogMock = {
    open: () => { },
    close: () => { }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [McExpansionPanelListAirComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [AALExpansionPanelListModule, HttpClientModule, HttpClientTestingModule,
        BrowserAnimationsModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [{provide: ServiceParametersService, useClass: ServiceParametersServiceMock},
        { provide: ChangeRequestService, useClass: ChangeRequestServiceMock },
        {provide: AgendaItemService, useClass: AgendaItemServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: {} }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McExpansionPanelListAirComponent);
    component = fixture.componentInstance;
    component.changeRequestFormGroup = new FormGroup({});
    component.changeRequestID = '123456';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call handleAIRList when triggered getAirListOnCRID',  () => {
    spyOn(component, 'handleAIRList');
    const xService = fixture.debugElement.injector.get(ChangeRequestService);
    spyOn(xService, 'getAirListOnCRID').and.returnValue(of([{
      number: '12345',
      shortDescription: 'short test',
      owner: {
        userID: 'userID',
        fullName: 'fullName',
        email: 'emaild',
        abbreviation: 'ABAV',
        departmentName: 'deptName'
      },
      description: 'description',
      solutionDescription: 'solutionDescription',
      initiator: {
        userID: 'userID',
        fullName: 'fullName',
        email: 'emaild',
        abbreviation: 'ABAV',
        departmentName: 'deptName'
      },
      solver: {
        userID: 'userID',
        fullName: 'fullName',
        email: 'emaild',
        abbreviation: 'ABAV',
        departmentName: 'deptName'
      },
      productID: 'productId',
      projectID: 'projectId',
      functionalClusterID: 'functionId',
      machineType: 'stringMachineType',
      priority: 'priority',
      type: 'typeString',
      errorInServiceCall: 'errorInService',
      itemType: 'itemType'}]));
    component.getAirListOnCRID('123456');
    expect(component.handleAIRList).toHaveBeenCalled();
  });

  it('should call handleError when error is thrown from getAirListOnCRID', () => {
    spyOn(component, 'handleError');
    const xService = fixture.debugElement.injector.get(ChangeRequestService);
    spyOn(xService, 'getAirListOnCRID').and.returnValue(throwError(new Error('test')));
    component.getAirListOnCRID('123456');
    expect(component.handleError).toHaveBeenCalled();
  });

  it('should throw error when triggered getAirListForLinkedObjectOfAI', () => {
    spyOn(component, 'handleError');
    const xService = fixture.debugElement.injector.get(AgendaItemService);
    spyOn(xService, 'getAIRItems').and.returnValue(throwError(new Error('test')));
    component.agendaItemId = '123456';
    component.getAirListForLinkedObjectOfAI();
    expect(component.handleError).toHaveBeenCalled();
  });

  it('should call handleAIRList when triggered getAirListForLinkedObjectOfAI',  () => {
    spyOn(component, 'handleAIRList');
    const xService = fixture.debugElement.injector.get(AgendaItemService);
    spyOn(xService, 'getAIRItems').and.returnValue(of([{
      number: '12345',
      shortDescription: 'short test',
      owner: {
        userID: 'userID',
        fullName: 'fullName',
        email: 'emaild',
        abbreviation: 'ABAV',
        departmentName: 'deptName'
      },
      description: 'description',
      solutionDescription: 'solutionDescription',
      initiator: {
        userID: 'userID',
        fullName: 'fullName',
        email: 'emaild',
        abbreviation: 'ABAV',
        departmentName: 'deptName'
      },
      solver: {
        userID: 'userID',
        fullName: 'fullName',
        email: 'emaild',
        abbreviation: 'ABAV',
        departmentName: 'deptName'
      },
      productID: 'productId',
      projectID: 'projectId',
      functionalClusterID: 'functionId',
      machineType: 'stringMachineType',
      priority: 'priority',
      type: 'typeString',
      errorInServiceCall: 'errorInService',
      itemType: 'itemType'}]));
    component.agendaItemId = '123456';
    component.getAirListForLinkedObjectOfAI();
    expect(component.handleAIRList).toHaveBeenCalled();
  });



  it('should call createItemList on triggered of handleAIRList', () => {
    spyOn(component, 'createItemList');
    const ProblemList = [{number: '12345',
      shortDescription: 'short test',
      owner: {
        userID: 'userID',
        fullName: 'fullName',
        email: 'emaild',
        abbreviation: 'ABAV',
        departmentName: 'deptName'
      },
      description: 'description',
      solutionDescription: 'solutionDescription',
      initiator: {
        userID: 'userID',
        fullName: 'fullName',
        email: 'emaild',
        abbreviation: 'ABAV',
        departmentName: 'deptName'
      },
      solver: {
        userID: 'userID',
        fullName: 'fullName',
        email: 'emaild',
        abbreviation: 'ABAV',
        departmentName: 'deptName'
      },
      productID: 'productId',
      projectID: 'projectId',
      functionalClusterID: 'functionId',
      machineType: 'stringMachineType',
      priority: 'priority',
      type: 'typeString',
      errorInServiceCall: 'errorInService',
      itemtype: 'itemType'}];
    component.handleAIRList(ProblemList);
    expect(component.createItemList).toHaveBeenCalled();
  });

  it('should expansionPanelItemConfigurationList length greater than zero on triggered createItemList', () => {
    component.itemsList = [{
      number: '12345',
      short_description: 'short test',
      owner: {
        user_id: 'userID',
        full_name: 'fullName',
        email: 'emaild',
        abbreviation: 'ABAV',
        department_name: 'deptName'
      },
      description: 'description',
      solution_description: 'solutionDescription',
      initiator: {
        user_id: 'userID',
        full_name: 'fullName',
        email: 'emaild',
        abbreviation: 'ABAV',
        department_name: 'deptName'
      },
      solver: {
        user_id: 'userID',
        full_name: 'fullName',
        email: 'emaild',
        abbreviation: 'ABAV',
        department_name: 'deptName'
      },
      productID: 'productId',
      projectID: 'projectId',
      functionalClusterID: 'functionId',
      machine_type: 'stringMachineType',
      priority: 'priority',
      type: 'typeString',
      errorInServiceCall: 'errorInService',
      itemType: 'itemType'}];
    component.airDeleteButtonSubscriptions.push(new Subscription());
    component.createItemList();
    expect(component.expansionPanelItemConfigurationList.length).toBeGreaterThan(0);
  });

  it('should call onAddAIRItem when triggered openAIRDialog', () => {
    spyOn(component, 'onAddAIRItem');
    component.openAIRDialog();
    expect(component.onAddAIRItem).toHaveBeenCalled();
  });

  it('should call deleteAIRItem method when onActionSubmit is triggered', () => {
    spyOn(component, 'deleteAIRItem');
    const $event = {ID: '123er'};
    component.onActionSubmit($event);
    expect(component.deleteAIRItem).toHaveBeenCalled();
  });

  it('should call createItemList when trigger ngOnChanges', () => {
    spyOn(component, 'createItemList');
    const simpleChange = {changeRequestFormGroup: new SimpleChange(null, {value:  {PCCSTRAIMIDs: ['123456', '345678'], ID: '123TR'}}, false)};
    component.ngOnChanges(simpleChange);
    expect(component.createItemList).toHaveBeenCalled();
  });

  it('should open dialog when triggered deleteAIRItem', () => {
    const xService = fixture.debugElement.injector.get(ChangeRequestService);
    spyOn(xService, 'unlinkAIRIssue$').and.returnValue(of({description: 'test', number: '123456', errorInServiceCall: 'test'} as Problem));
    spyOn(component.matDialog, 'open').and.returnValue(dialogRefSpyObj);

    const expansionPanelItemConfigList = [new ExpansionPanelItemConfiguration()];
    expansionPanelItemConfigList[0].ID = '123456';
    component.expansionPanelItemConfigurationList = expansionPanelItemConfigList;
    component.changeRequestFormGroup = new FormGroup({
      ID: new FormControl('test')
    });
    component.deleteAIRItem('123456');
    expect(component.matDialog.open).toHaveBeenCalled();
  });

  it('should open dialog on onAddAIRItem',  () => {
    spyOn(component.matDialog, 'open').and.returnValue(dialogRefSpyObj1);
    component.changeRequestFormGroup = new FormGroup({
      ID: new FormControl('test'),
      PBSIDs: new FormControl([]),
      PCCSTRAIMIDs: new FormControl([])
    });
    component.onAddAIRItem('testString');
    expect(component.matDialog.open).toHaveBeenCalled();
  });

  it('should open window with change request page when onAddAIRItem is trigger ',  () => {
    spyOn(component.matDialog, 'open').and.returnValue(dialogRefSpyObj1);
    spyOn(window, 'open');
    component.changeRequestFormGroup = new FormGroup({
      ID: new FormControl('123456'),
      PBSIDs: new FormControl([]),
      PCCSTRAIMIDs: new FormControl([])
    });
    component.openDialog = true;
    component.onAddAIRItem('testString');
    expect(window.open).toHaveBeenCalledWith('/change-requests/123456', '_self');
  });

});

class ServiceParametersServiceMock {
  getServiceParameter(type: string, category: string, action: string) {
    return [{}] as Value[];
  }
}

class AgendaItemServiceMock {
  getAIRItems(agendaId) {
    return of([{number: '12345',
      shortDescription: 'short test',
      owner: {
        userID: 'userID',
        fullName: 'fullName',
        email: 'emaild',
        abbreviation: 'ABAV',
        departmentName: 'deptName'
      },
      description: 'description',
      solutionDescription: 'solutionDescription',
      initiator: 'initiator',
      solver: 'solver',
      productID: 'productId',
      projectID: 'projectId',
      functionalClusterID: 'functionId',
      machineType: 'stringMachineType',
      priority: 'priority',
      type: 'typeString',
      errorInServiceCall: 'errorInService',
      itemtype: 'itemType'}]);
  }
}
