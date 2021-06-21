import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Observable, of, throwError} from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA, SimpleChange} from '@angular/core';
import {StoreModule} from '@ngrx/store';


import { UpdateFieldService } from '../../../core/services/update-field.service';
import {metaReducers, reducers} from '../../../store';
import {FormControlConfiguration} from '../../models/mc-configuration.model';
import {MCFieldComponent} from '../mc-field/mc-field.component';
import {ProjectService} from '../../../core/services/project.service';
import { MCAutoCompleteProductSingleComponent } from './mc-auto-complete-product-single.component';

describe('MCAutoCompleteProductSingleComponent', () => {
  class UpdateFieldServiceMock {
    updateField$(): Observable<any> {
      return Observable.of();
    }
  }
  let component: MCAutoCompleteProductSingleComponent;
  let fixture: ComponentFixture<MCAutoCompleteProductSingleComponent>;
  let controlConfig: FormControlConfiguration;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCAutoCompleteProductSingleComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [AALInputTextModule,
        HttpClientModule,
        StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        { provide: UpdateFieldService, useClass: UpdateFieldServiceMock },
        { provide: ProjectService, useClass: ProjectServiceMock}
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(MCAutoCompleteProductSingleComponent);
    component = fixture.componentInstance;
    controlConfig = {
      'validatorConfiguration': {'required': 1}
    };
    component.controlConfiguration = controlConfig;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getProjectDetails should be call on initialization when caseOjectId is set', () => {
    spyOn(component, 'getProjectDetails');
    component.caseObject = {ID: '1234', revision: 'test revision', type: 'AA'};
    component.caseObjectId = 123;
    component.type = 'changeRequest';
    component.ngOnInit();
    expect(component.getProjectDetails).toHaveBeenCalled();
  });

  it('should call super method saveFieldChanges when onAcceptedChange trigger', () => {
    spyOn(MCFieldComponent.prototype, 'saveFieldChanges');
    component.control = new FormControl('new value');
    const change: AcceptedChange = { ID: 'elementID', oldValue: {projectDefinition: 'test'}, value: {projectDefinition: 'test'}};
    component.onAcceptChange(change);
    expect(MCFieldComponent.prototype.saveFieldChanges).toHaveBeenCalled();
  });

  it('Should set value to control when ngOnChanges is triggered with simpleChange value', () => {
    component.control = new FormControl('new value');
    component.ngOnChanges({'control': new SimpleChange(null, {number: '1234', value: {projectDefinition: '1234'}}, false)});
    expect(component.projectDefinition).toBe('1234');
  });

  it('should set service response to projectDefinition when getProjectDetails is triggered', () => {
    component.control = new FormControl('new value');
    component.caseObject = {ID: '1234', revision: 'test revision', type: 'AA'};
    component.caseObjectId = 1234;
    component.type = 'changeRequest';
    component.getProjectDetails();
    expect(component.projectDefinition).toContain('test');
  });

  it('should set error message when getProjectDetails triggered and getProject service return error response', () => {
    const xService = fixture.debugElement.injector.get(ProjectService);
    spyOn(xService, 'getProject$').and.returnValue(throwError(new Error('error test')));
    component.control = new FormControl('new value');
    component.caseObject = {ID: '1234', revision: 'test revision', type: 'AA'};
    component.caseObjectId = 12345;
    component.type = 'changeRequest';
    component.getProjectDetails();
    expect(component.fetchError.message).toContain('myChange did not work as expected');
  });
});

class ProjectServiceMock {
  getProjects$(caseObjectId, caseObjectRevision) {
    if (caseObjectId === 12345) {
      return throwError({error: 'error'});
    } else {
      return of({projectDefinition: 'test'});
    }
  }

  getProject$(caseObjectId, type, caseObjectRevision) {
    if (caseObjectId === 12345) {
      return throwError({error: 'error'});
    } else {
      return of({projectDefinition: 'test'});
    }
  }
}
