import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {Observable, of, throwError} from 'rxjs';
import {HttpClientModule} from '@angular/common/http';
import {FormControl} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA, SimpleChange} from '@angular/core';
import {StoreModule} from '@ngrx/store';

import {MCAutoCompleteFunctionalClusterSingleComponent} from './mc-auto-complete-functional-cluster-single.component';
import {UpdateFieldService} from '../../../core/services/update-field.service';
import {metaReducers, reducers} from '../../../store';
import {FormControlConfiguration} from '../../models/mc-configuration.model';
import {ChangeRequestService} from '../../../change-request/change-request.service';
import {MCFieldComponent} from '../mc-field/mc-field.component';

describe('MCAutoCompleteFunctionalClusterSingleComponent', () => {
  class UpdateFieldServiceMock {
    updateField$(): Observable<any> {
      return Observable.of();
    }
  }

  let component: MCAutoCompleteFunctionalClusterSingleComponent;
  let fixture: ComponentFixture<MCAutoCompleteFunctionalClusterSingleComponent>;
  let controlConfig: FormControlConfiguration;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MCAutoCompleteFunctionalClusterSingleComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [AALInputTextModule, HttpClientModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        {provide: UpdateFieldService, useClass: UpdateFieldServiceMock},
        {provide: ChangeRequestService, useClass: ChangeRequestServiceMock}
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(MCAutoCompleteFunctionalClusterSingleComponent);
    component = fixture.componentInstance;
    controlConfig = {
      'validatorConfiguration': {'required': 1}
    };
    component.controlConfiguration = controlConfig;
    component.control = new FormControl();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Component should be initialized and getProjectDetails to be trigger', () => {
    spyOn(component, 'getFunctionalClusterOnCRID');
    component.changeRequestID = '1234';
    component.ngOnInit();
    expect(component.getFunctionalClusterOnCRID).toHaveBeenCalled();
  });

  it('Should have call saveFieldChanges on AcceptChange Trigger', () => {
    spyOn(MCFieldComponent.prototype, 'saveFieldChanges');
    component.control = new FormControl('new value');
    const change: AcceptedChange = {ID: 'functionalClusterID', oldValue: {number: 'FC-002', name: ''}, value: {number: 'FC-004', name: 'Reticle Positioning'}};
    component.onAcceptChange(change);
    expect(MCFieldComponent.prototype.saveFieldChanges).toHaveBeenCalled();
  });

  it('component changes should be captured in ngOnChanges', () => {
    component.control = new FormControl('new value');
    component.ngOnChanges({'control': new SimpleChange(null, {number: '1234', value: '1234'}, false)});
    expect(component.functionalClusterID).toBe('1234');
  });

  it('Should set functionalClusterID when getFunctionalClusterOnCRID on triggered', () => {
    const xService = fixture.debugElement.injector.get(ChangeRequestService);
    spyOn(xService, 'getFunctionalClusterOnCRID').and.returnValue(of({
      number: 'FC-109',
      name: 'Mechanical Layout-YS'
    }));
    const changeRequestID = '1234';
    component.getFunctionalClusterOnCRID(changeRequestID);
    expect(component.functionalClusterID).toBe('FC-109');
  });

  it('Should set error message for fetchError when getFunctionalClusterOnCRID on triggered', () => {
    const xService = fixture.debugElement.injector.get(ChangeRequestService);
    spyOn(xService, 'getFunctionalClusterOnCRID').and.returnValue(throwError(new Error('message')));
    component.functionalClusterID = '1234';
    const changeRequestID = '1234';
    component.getFunctionalClusterOnCRID(changeRequestID);
    expect(component.control.value).toEqual({ number: '1234', name: '' });
  });

  it('should return ChangeReuest id when changeRequestID is triggered',  () => {
    component.CRId = '1234';
    expect(component.changeRequestID).toBe('1234')
  });
});

class ChangeRequestServiceMock {
  getFunctionalClusterOnCRID(caseObjectId, caseObjectRevision) {
    return of([{
      number: 'FC-109',
      name: 'Mechanical Layout-YS'
    }]);
  }
}
