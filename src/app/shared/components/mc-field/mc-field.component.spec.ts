import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {HttpClientModule} from '@angular/common/http';
import {FormControl} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA, DebugElement} from '@angular/core';
import {StoreModule} from '@ngrx/store';


import {MCFieldComponent} from './mc-field.component';
import {UpdateFieldService} from '../../../core/services/update-field.service';
import {metaReducers, reducers, showLoader} from '../../../store';
import {
  FieldElement,
  UpdateFieldRequest,
  UpdateFieldResponse,
  UpdateInstanceRequest
} from '../../models/field-element.model';
import {CaseObject} from '../../models/mc.model';
import {FieldUpdateStates, RequestTypes} from '../../models/mc-enums';

describe('MCFieldComponent', () => {

  let component: MCFieldComponent;
  let fixture: ComponentFixture<MCFieldComponent>;
  let debugElement: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCFieldComponent ],
      imports: [AALInputTextModule,
        HttpClientModule, StoreModule.forRoot(reducers, {metaReducers})],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: UpdateFieldService, useClass: UpdateFieldServiceMock }]
    })
      .compileComponents();
    fixture = TestBed.createComponent(MCFieldComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component.control = new FormControl('new value');
    component.controlConfiguration = {
      help: 'This gives you more information about the field'
    };
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set field element object in the request if the value is of string type', () => {
    const changeObj: AcceptedChange = {'ID': 'fieldId', 'oldValue': 'field old value', 'value': 'field new value'};
    const request = component.processRequest(changeObj) as UpdateFieldRequest;
    expect((request.FieldElement as FieldElement[]).length).toBeGreaterThan(0);
  });

  it('should set list field element object in the request if the value is of array type', () => {
    const changeObj: AcceptedChange = {'ID': 'fieldId', 'oldValue': ['1'], 'value': ['abc']};
    const request = component.processRequest(changeObj) as UpdateFieldRequest;
    expect(request.ListFieldElement.length).toBeGreaterThan(0);
  });

  /*it('should set instance element object in the request if the value is multiheirarical', () => {
    component.requestType = RequestTypes.Instance;
    const changeObj: AcceptedChange = {'ID': 'sample.data', 'oldValue': '', 'value': 'abc'};
    const request = component.processRequest(changeObj);
    expect(request.ListFieldElement.length).toBeGreaterThan(0);
  });*/

  /*it('should set instance request if the value is multiheirarical has square notation', () => {
    component.requestType = RequestTypes.Instance;
    const changeObj: AcceptedChange = {'ID': 'sample[data]', 'oldValue': '', 'value': 'abc'};
    const request = component.processRequest(changeObj);
    expect(request.ListFieldElement.length).toBeGreaterThan(0);
  });*/

  /*it('should set instance element object in the request if the value is single levelled', () => {
    component.requestType = RequestTypes.Instance;
    const changeObj: AcceptedChange = {'ID': 'fieldId', 'oldValue': '', 'value': 'abc'};
    const request = component.processRequest(changeObj);
    expect(request.ListFieldElement.length).toBeGreaterThan(0);
  });*/

  it('check if bubbledAcceptChanges is emitted on onAcceptChanges, when field save not applicable is set', () => {
    spyOn(component.bubbledAcceptChanges, 'emit');
    const changeObj: AcceptedChange = {'ID': 'fieldId', 'oldValue': 'field old value', 'value': 'field new value'};
    component.fieldSaveNotApplicable = true;
    component.onAcceptChanges(changeObj);
    expect(component.bubbledAcceptChanges.emit).toHaveBeenCalled();
  });

  it('should return when onAcceptChanges is trigger, when no case object is set', () => {
    const changeObj: AcceptedChange = {'ID': 'fieldId', 'oldValue': 'field old value', 'value': 'field new value'};
    const returnValue = component.onAcceptChanges(changeObj);
    expect(returnValue).toBe(undefined);
  });

  it('should set mode when change object is changed (called from subscription of selectCaseObject action)', () => {
    spyOn(component, 'setMode');
    const changeObjectState = {ID: '123', revision: 'AA', type: 'ChangeRequest', sourceSystemID: '123456789'};
    component.modeFixed = 'EDIT';
    component.onChangeObjectChanged(changeObjectState);
    expect(component.setMode).toHaveBeenCalled();
  });

  it('should subscribe to readonlyFields state when setMode is called', () => {
    spyOn(component, 'subscribeToReadOnlyState');
    component.caseObject = {ID: '123', revision: 'AA', type: 'ChangeRequest'};
    component.caseObjectType = 'ChangeRequest';
    component.setMode();
    expect(component.subscribeToReadOnlyState).toHaveBeenCalled();
  });

  it('should set the mode to READ when field configuration is not set and if the field is not present in read only fields list', () => {
    component.caseObject = {ID: '123', revision: 'AA', type: 'ChangeRequest'};
    component.caseObjectType = 'ChangeRequest';
    component.fieldConfiguration = null;
    component.subscribeToReadOnlyState();
    expect(component.mode).toBe(Modes.PROTECTED);
  });

  it('should emit bubbledAcceptChanges on accepting changes when bubbleAcceptChanges is true', () => {
    spyOn(component.bubbledAcceptChanges, 'emit');
    component.bubbleAcceptChanges = true;
    const req = {
      ID: 'fieldId',
      value: 'new test',
      oldValue: 'old test'
    } as AcceptedChange;
    component.caseObject = {ID: '12333', type: 'ChangeRequest', revision: 'AA'};
    component.onAcceptChanges(req);
    expect(component.bubbledAcceptChanges.emit).toHaveBeenCalled();
  });

  it('should change the state of behaviour object when supplied on saveFieldChanges', () => {
    const updated$ = new BehaviorSubject('');
    spyOn(updated$, 'next');
    const req = {
      FieldElement: [{
        ID: 'fieldId',
        newValue: 'new test',
        oldValue: 'old test'
      }],
      ListFieldElement: []
    } as UpdateFieldRequest;
    component.caseObject = {ID: '323232', type: 'ChangeRequest', revision: 'AA'};
    component.saveFieldChanges(req, 'fieldId', updated$);
    expect(component.serverError).toBe(null);
  });

  it('should call emitSaveEvent on saveFieldChanges', () => {
    spyOn(component, 'emitSaveEvent');
    const updated$ = new BehaviorSubject('');
    const req = {
      FieldElement: [{
        ID: 'fieldId',
        newValue: 'new test',
        oldValue: 'old test'
      }],
      ListFieldElement: []
    } as UpdateFieldRequest;
    component.caseObject = {ID: 'fieldId', type: 'ChangeRequest', revision: 'AA'};
    component.caseObjectType = 'AA';
    component.saveFieldChanges(req, 'fieldId', updated$);
    expect(component.emitSaveEvent).toHaveBeenCalled();
  });

  it('should return the request is not in format on saveFieldChanges', () => {
    const req = {
      FieldElement: [],
      ListFieldElement: []
    } as UpdateFieldRequest;
    const returnValue = component.saveFieldChanges(req, 'fieldId');
    expect(returnValue).toBe(undefined);
  });

  it('should set the busy flag in store when handleBusy is trigger', () => {
    spyOn(component.appStore, 'dispatch');
    component.caseObjectType = 'Button';
    component.handleBusy('generalInformation.title', false);
    expect(component.appStore.dispatch).toHaveBeenCalledWith(showLoader(false));
  });

  it('should call setMode on Init', () => {
    spyOn(component, 'setMode');
    component.caseObject = {type: 'ChangeRequest', revision: 'AA', ID: 'caseObjectID'};
    component.ngOnInit();
    expect(component.setMode).toHaveBeenCalled();
  });
  it('should subscribe to readonly state when mode is not fixed', () => {
    component.caseObject = {ID: '234567', type: 'ChangeRequest', revision: 'AA'};
    component.setMode();
    expect(component.fieldReadOnlySubscription$).toBeTruthy();
  });
  it('should set serverError when save is failed', () => {
    const req = {
      ID: 'fieldId',
      value: 'new value',
      oldValue: 'old value'
    };
    const xService = fixture.debugElement.injector.get(UpdateFieldService);
    const error$ = new BehaviorSubject({} as Info);
    spyOn(xService, 'updateField$').and.returnValue(of({
      FieldElement: [{
        ID: 'fieldId',
        newValue: 'new value',
        oldValue: 'old value',
        response: {status: 'ERROR'}
      }],
      ChangeRequestElement: {}
    } as UpdateFieldResponse));
    component.caseObject = {ID: '234567', type: 'ChangeRequest', revision: 'AA'};
    component.saveFieldChanges(component.processRequest(req), 'fieldId', null, error$);
    expect(component.serverError.level).toBe(InfoLevels.ERROR);
  });
  it('should set serverError when response object and status  is present in response', () => {
    const req = {
      ID: 'fieldId',
      value: 'new value',
      oldValue: 'old value'
    };
    spyOn(component, 'updateFieldState');
    const xService = fixture.debugElement.injector.get(UpdateFieldService);
    spyOn(xService, 'updateField$').and.returnValue(of({
      FieldElement: [{
        ID: 'fieldId',
        newValue: 'new value',
        oldValue: 'old value'
      }],
      ChangeRequestElement: {}
    } as UpdateFieldResponse));
    component.caseObject = {ID: '234567', type: 'ChangeRequest', revision: 'AA'};
    component.onAcceptChanges(req);
    expect(component.serverError.message).toBeTruthy();
  });
  it('should set error message when no response is received from service response', () => {
    const req = {
      ID: 'fieldId',
      value: 'new value',
      oldValue: 'old value'
    };
    spyOn(component, 'updateFieldState');
    const xService = fixture.debugElement.injector.get(UpdateFieldService);
    spyOn(xService, 'updateField$').and.returnValue(of(null));
    component.caseObject = {ID: '234567', type: 'ChangeRequest', revision: 'AA'};
    component.onAcceptChanges(req);
    expect(component.serverError.message).toBeTruthy();
  });
  it('should call method to update store with success status on success response', () => {
    const req = {
      ID: 'fieldId',
      value: 'new value',
      oldValue: 'old value'
    };
    spyOn(component, 'updateFieldState');
    const xService = fixture.debugElement.injector.get(UpdateFieldService);
    spyOn(xService, 'updateField$').and.returnValue(of({
      FieldElement: [{
        ID: 'fieldId',
        newValue: 'new value',
        oldValue: 'old value',
        response: {status: 'SUCCESS'}
      }],
      ChangeRequestElement: {}
    } as UpdateFieldResponse));
    component.caseObject = {ID: '234567', type: 'ChangeRequest', revision: 'AA'};
    component.onAcceptChanges(req);
    expect(component.updateFieldState).toHaveBeenCalledWith('fieldId', FieldUpdateStates.success);
  });
  it('in case of list field element - should call method to update store with success status on success response', () => {
    const req = {
      ID: 'fieldId',
      value: ['new value'],
      oldValue: ['old value']
    };
    spyOn(component, 'updateFieldState');
    const xService = fixture.debugElement.injector.get(UpdateFieldService);
    spyOn(xService, 'updateField$').and.returnValue(of({
      FieldElement: [],
      ListFieldElement: [{
        ID: 'fieldId',
        newValue: ['new value'],
        oldValue: ['old value'],
        response: {status: 'SUCCESS'}
      }],
      ChangeRequestElement: {}
    } as UpdateFieldResponse));
    component.caseObject = {ID: '234567', type: 'ChangeRequest', revision: 'AA'};
    component.onAcceptChanges(req);
    expect(component.updateFieldState).toHaveBeenCalledWith('fieldId', FieldUpdateStates.success);
  });
});

class UpdateFieldServiceMock {
  updateField$(change: CaseObject, request: UpdateFieldRequest): Observable<any> {
    return of({
      FieldElement: [{
        ID: 'fieldId',
        newValue: request.FieldElement[0].newValue,
        oldValue: request.FieldElement[0].oldValue,
        response: {status: 'SUCCESS'}
      }],
      ListFieldElement: []
    } as UpdateFieldRequest);
  }
}
