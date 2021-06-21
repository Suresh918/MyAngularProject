import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {FormControl} from '@angular/forms';
import {BehaviorSubject, of} from 'rxjs';

import { MCAutoCompleteProjectLeadComponent } from './mc-auto-complete-project-lead.component';
import {MCAutoCompleteUserSingleComponent} from '../mc-auto-complete-user-single/mc-auto-complete-user-single.component';
import {ProjectManagerService} from '../../../core/services/project-manager.service';
import {metaReducers, reducers} from '../../../store';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';

describe('MCAutoCompleteProjectLeadComponent', () => {
  let component: MCAutoCompleteProjectLeadComponent;
  let fixture: ComponentFixture<MCAutoCompleteProjectLeadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCAutoCompleteProjectLeadComponent, MCAutoCompleteUserSingleComponent ],
      imports: [AALOverlayCardErrorModule, AALAutoCompleteSingleModule, HttpClientModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        { provide: ProjectManagerService, useClass: ProjectManagerServiceMock},
        {provide: ServiceParametersService, useClass: ServiceParametersServiceMock}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCAutoCompleteProjectLeadComponent);
    component = fixture.componentInstance;
    component.control = new FormControl({});
    component.controlConfiguration = {ID: '1234', placeholder: 'test', help: 'test help', hint: 'test hint'};
    component.projectLeadUpdate$ = new BehaviorSubject<string>('testValue');
    component.instanceResponse$ = new BehaviorSubject<string>('testValue');
    spyOn(component.projectLeadUpdate$, 'next');
    spyOn(component.instanceResponse$, 'next');
   // fixture.detectChanges();
  });

  it('should create', () => {
    component.caseObjectId = 1234;
    expect(component).toBeTruthy();
  });

  it('should call getProjectManager on initialization', () => {
    spyOn(component, 'getProjectManager');
    component.ngOnInit();
    expect(component.getProjectManager).toHaveBeenCalled();
  });

  it('should call updateFields when type is set',  () => {
    spyOn(component, 'updateFields');
    component.caseObject = {ID: '1234', revision: 'test revision1', type: 'AA'};
    component.caseObjectId = 1234;
    component.type = 'changeRequest';
    expect(component.updateFields).toHaveBeenCalled();
  });

  it('should set value to control on trigger getProjectManager', () => {
    component.caseObject = {ID: '1234', revision: 'test revision2', type: 'AA'};
    component.caseObjectId = 1234;
    component.type = 'changeRequest';
    component.projectID = '123456';
    component.getProjectManager();
    expect(component.control.value.fullName).toBe('test full name');
  });

  it('should set serverError message when trigger getProjectManager on error', () => {
    component.caseObject = {ID: '1234', revision: 'test revision', type: 'AA'};
    component.caseObjectId = 12345;
    component.type = 'changeRequest';
    component.projectID = '123456';
    component.getProjectManager();
    expect(component.serverError.message).toContain('myChange did not work as expected');
  });
  class ProjectManagerServiceMock {
     getProjectManager$(caseObjectId, type, caseObjectRevision) {
      if (component.caseObjectId === 12345) {
        return of({error: 'error'});
      } else {
        return of({
          userID: '1234',
          fullName: 'test full name',
          email: 'email@email.com',
          abbreviation: 'ABCD'
        });
      }
    }
  }
});
class ServiceParametersServiceMock {
  getServiceParameter(): any[] { return [{name: 'http://imagepath.jpg/{USER-ID}'}]; }
}
