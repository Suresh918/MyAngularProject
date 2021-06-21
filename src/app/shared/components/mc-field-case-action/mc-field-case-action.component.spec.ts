import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {StoreModule} from '@ngrx/store';
import {of} from 'rxjs';
import {metaReducers, reducers} from '../../../store';
import { MCFieldCaseActionComponent } from './mc-field-case-action.component';
import {UpdateFieldService} from '../../../core/services/update-field.service';
import {CaseActionService} from '../../../core/services/case-action-service';
import { UpdateFieldResponse} from '../../models/field-element.model';


describe('MCFieldCaseActionComponent', () => {
  let component: MCFieldCaseActionComponent;
  let fixture: ComponentFixture<MCFieldCaseActionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCFieldCaseActionComponent ],
      imports: [HttpClientModule, MatDialogModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        {provide: UpdateFieldService, useClass: UpdateFieldServiceMock},
        {provide: CaseActionService, useClass: CaseActionServiceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCFieldCaseActionComponent);
    component = fixture.componentInstance;
    component.caseObject = {ID: '123456', type: 'request', revision: 'AA'};
    component.caseObjectType = 'request';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return nothing when caseObject is not set', () => {
    const $changeObj: AcceptedChange = {'ID': 'fieldId', 'oldValue': 'field old value', 'value': 'field new value'};
    expect(component.onAcceptChanges($changeObj)).toBe(undefined);
  });

  it('should call saveStatusChanges on onAcceptChanges when caseObject is set',  () => {
    spyOn(component, 'saveStatusChanges');
    const $changeObj: AcceptedChange = {'ID': 'fieldId', 'oldValue': 'field old value', 'value': 'field new value'};
    component.caseObject = {ID: '123456', type: 'request', revision: 'AA'};
    component.caseObjectType = 'request';
    component.onAcceptChanges($changeObj);
    expect(component.saveStatusChanges).toHaveBeenCalledWith(component.caseObject, $changeObj);
  });

  it('should emit caseActionChanges in case of success response', () => {
    spyOn(component.caseActionChangeSuccess, 'emit');
    const $changeObj: AcceptedChange = {'ID': 'fieldId', 'oldValue': 'field old value', 'value': 'field new value'};
    component.caseObject = {ID: '123456', type: 'request', revision: 'AA'};
    component.caseObjectType = 'request';
    component.saveStatusChanges(component.caseObject, $changeObj);
    expect(component.caseActionChangeSuccess.emit).toHaveBeenCalled();
  });

  it('should set serverError value in case of error is thrown while saving status changes', () => {
    const xService = fixture.debugElement.injector.get(UpdateFieldService);
    spyOn(xService, 'updateStatusField$').and.returnValue(of({} as UpdateFieldResponse));
    const $changeObj: AcceptedChange = {'ID': 'fieldId', 'oldValue': 'field old value', 'value': 'field new value'};
    component.caseObject = {ID: '123456', type: 'request', revision: 'AA'};
    component.caseObjectType = 'request';
    component.saveStatusChanges(component.caseObject, $changeObj);
    expect(component.serverError).toBeTruthy();
  });

});
class UpdateFieldServiceMock {
  updateStatusField$(id, path, value) {
    return of({
      FieldElement: [{
        ID: 'fieldId',
        newValue: 'new test',
        oldValue: 'old test'
      }],
      ChangeRequestElement: [{ ID: 'string',
        revision: 'revision test',
        revisionStatus: 'revisionStatus test',
        generalInformation: {},
        changeRequestType: 'AA',
        inScope: 'inScope tets',
        outScope: 'outScope test',
        testAndReleaseStrategy: 'release Tets',
        analysisPriority: 2,
        implementationPriority: 1}]});
  }
}

class CaseActionServiceMock {
  getCaseActionsForStatuses() {
    return of({request: [{test: 'test', status: 'field new value', caseAction: 'ADD'}]});
  }
}
