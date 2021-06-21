import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {Observable, of, throwError} from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import {FormControl } from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA, SimpleChange} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import { MCAutoCompleteProjectSingleComponent } from './mc-auto-complete-project-single.component';
import { UpdateFieldService } from '../../../core/services/update-field.service';
import {metaReducers, reducers} from '../../../store';
import {FormControlConfiguration} from '../../models/mc-configuration.model';
import {MCAutoCompleteProjectLeadComponent} from '../mc-auto-complete-project-lead/mc-auto-complete-project-lead.component';
import {WorkBreakdownStructureService} from '../../../core/services/work-breakdown-structure.service';
import {HelpersService} from '../../../core/utilities/helpers.service';

describe('MCAutoCompleteProjectSingleComponent', () => {
  class UpdateFieldServiceMock {
    updateField$(): Observable<any> {
      return Observable.of();
    }
  }

  let component: MCAutoCompleteProjectSingleComponent;
  let fixture: ComponentFixture<MCAutoCompleteProjectSingleComponent>;
  let controlConfig: FormControlConfiguration;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCAutoCompleteProjectSingleComponent, MCAutoCompleteProjectLeadComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [AALAutoCompleteSingleModule,
        HttpClientModule,
        StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        { provide: UpdateFieldService, useClass: UpdateFieldServiceMock },
        { provide: WorkBreakdownStructureService, useClass: WorkBreakdownStructureServiceMock },
        { provide: HelpersService, useClass: HelpersServiceMock}
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(MCAutoCompleteProjectSingleComponent);
    component = fixture.componentInstance;
    controlConfig = {
      'validatorConfiguration': {'required': 1}
    };
    component.controlConfiguration = controlConfig;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getWBSDetails on initialization', () => {
    spyOn(component, 'getWBSDetails');
    component.caseObjectId = 123;
    component.type = 'ChangeRequest';
    component.ngOnInit();
    expect(component.getWBSDetails).toHaveBeenCalled();
  });

  it('should set value for wbsElement when service call return success response with wbsElement', () => {
    component.control = new FormControl({wbsElement: 'test'});
    component.caseObject = {ID: '1234', revision: 'test revision', type: 'AA'};
    component.caseObjectId = 123;
    component.type = 'ChangeRequest';
    component.getWBSDetails();
    expect(component.wbsElement).toBe('1234');
  });

  it('should set value for fetchError when WorkBreakdownStructureService return on Error exception', () => {
    const xService = fixture.debugElement.injector.get(WorkBreakdownStructureService);
    spyOn(xService, 'getWorkBreakdownStructureFromCaseObject').and.returnValue(throwError(new Error('error')));
    component.control = new FormControl({wbsElement: 'test'});
    component.caseObject = {ID: '1234', revision: 'test revision', type: 'AA'};
    component.caseObjectId = 12345;
    component.type = 'ChangeRequest1';
    component.getWBSDetails();
    expect(component.fetchError.message).toBe('error');
  });

  it('component changes should be captured in ngOnChanges', () => {
    component.control = new FormControl('new value');
    component.ngOnChanges({'control': new SimpleChange(null, {number: '1234', value: {wbsElement: '1234'}}, false)});
    expect(component.wbsElement).toBe('1234');
  });


  it('Should set for wbsElement when onAcceptChanges is triggered', () => {
    component.control = new FormControl({wbsElement: '1234'});
    const change: AcceptedChange = { ID: 'elementID', oldValue: {wbsElement: 'test'}, value: {wbsElement: 'test'} };
    component.caseObject = {
      ID: 'elem',
      revision: 'aa',
      type: 'test string'
    };
    component.onAcceptChange(change);
    expect(component.wbsElement).toBe('1234');
  });

  it('should set error message onAcceptChanges gets method triggered', () => {
    component.control = new FormControl({wbsElement: '1234'});
    const change: AcceptedChange = { ID: 'elementID', oldValue: {wbsElement: 'test'}, value: {wbsElement: 'test'} };
    component.caseObject = {
      ID: 'elem1',
      revision: 'aa',
      type: 'test string'
    };
    component.onAcceptChange(change);
    expect(component.serverError.message).toBe('error');
  });

  class WorkBreakdownStructureServiceMock {
    saveWBS(newValue, caseObject): Observable<any> {
      if (component.caseObject.ID === 'elem1') {
        return of('');
      } else {
        return of({ 'name': 'name1' });
      }
    }

    getErrorMessage() {
      return 'error';
    }

    getWorkBreakdownStructures$(data) {
      return of({test: 'test'});
    }

    getWorkBreakdownStructureFromCaseObject(caseObjectId, type, caseObjectRevision) {
      if (component.caseObjectId === 12345) {
        return throwError({error: 'error'});
      } else {
        return of([{wbsElement: '1234'}]);
      }
    }
  }

  class HelpersServiceMock {
    getErrorMessage() {
      return 'error';
    }
  }
});
