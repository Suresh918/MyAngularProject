import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {StoreModule} from '@ngrx/store';
import {HttpClientModule} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {provideMockStore} from '@ngrx/store/testing';
import {of} from 'rxjs';

import {metaReducers, reducers} from '../../../store';
import {MCButtonComponent} from './mc-button.component';
import {CaseObject, ChangeRequest} from '../../models/mc.model';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';
import {Value} from '../../models/service-parameters.model';
import {MatDialogNavigationConfirmationComponent} from '../mat-dialog-navigation-confirmation/mat-dialog-navigation-confirmation.component';


describe('MCButtonComponent', () => {
  let component: MCButtonComponent;
  let fixture: ComponentFixture<MCButtonComponent>;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of({caseObject: 'changeRequest', filterName: 'testFilterName'},
    ), close: null });
  const dialogMock = {
    close: () => { }
  };
  const landingState = {
    caseObjectState: {
      caseObjectType: 'ChangeRequest',
      caseObject: {
        ID: '123456',
        revision: 'AA',
        revisionStatus: 'Active'
      }
    }
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MCButtonComponent, MatDialogNavigationConfirmationComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [StoreModule.forRoot(reducers, {metaReducers}), HttpClientModule, MatDialogModule, BrowserAnimationsModule],
      providers: [{provide: ServiceParametersService, useClass: ServiceParametersServiceMock},
        {provide: MatDialogRef, useValue: dialogMock},
        {provide: MAT_DIALOG_DATA, useValue: {}},
        provideMockStore({initialState: landingState})]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [MatDialogNavigationConfirmationComponent]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the case object and subscribe to specific case action', () => {
    component.isLinkedItem = true;
    component.buttonAction = 'submit';
    component.caseObject = new CaseObject('1234', 'AA', 'ChangeRequest');
    fixture.detectChanges();
    expect(component.caseObject).toBeTruthy();
  });

  it('should set the case object data', waitForAsync(() => {
    component.caseObject = new CaseObject('1234', 'AA', 'ChangeRequest');
    fixture.detectChanges();
    expect(component.caseObjectData).toBeTruthy();
  }));

  it('should have assign value to name property when text property value is set', () => {
    component.text = 'test text';
    expect(component.name).toBe('test text');
  });

  it('should have assign value for currentState property when state property is set',  () => {
    component.state = 'INPROGRESS';
    expect(component.currentState).toBe('INPROGRESS');
  });

  it('should call getServiceParameters when ngOnItIt Trigger when isGenericButton is true', () => {
    spyOn(component, 'getServiceParameters');
    component.buttonAction = 'INPROGRESS';
    component.isGenericButton = true;

    component.ngOnInit();
    expect(component.getServiceParameters).toHaveBeenCalled();
  });

  it('button click should emit an event', waitForAsync(() => {
    const spy = spyOn(component.buttonClick, 'emit');
    component.showDialog = false;
    component.onButtonClick(new Event('click'));
    expect(spy).toHaveBeenCalled();
  }));

  it('button click should emit an event', waitForAsync(() => {
    const spy = spyOn(component.buttonClick, 'emit');
    component.showDialog = false;
    component.showDialogNotApplicable = false;
    component.onButtonClick(new Event('click'));
    expect(spy).toHaveBeenCalled();
  }));

  it('button click should emit an event when dialog is open', waitForAsync(() => {
    spyOn(component.dialog, 'open').and.returnValue(dialogRefSpyObj);
    const spy = spyOn(component.buttonClick, 'emit');
    component.showDialog = true;
    component.showDialogNotApplicable = false;
    component.onButtonClick(new Event('click'));
    expect(spy).toHaveBeenCalled();
  }));

  it('should set name when caseObjectType is empty on trigger of getServiceParameters',  () => {
    component.caseObject = new CaseObject('1234', 'AA', 'ChangeRequest');
    component.caseObjectType = '';
    component.getServiceParameters();
    expect(component.name).toBe('label test');
  });

  it('should set tooltipForDisabled when caseObjectType is ReviewTask on trigger of getServiceParameters',  () => {
    component.caseObject = new CaseObject('1234', 'AA', 'ChangeRequest');
    component.caseObjectType = 'ReviewTask';
    component.getServiceParameters();
    expect(component.tooltipForDisabled ).toBe('tool tip is disable');
  });

  it('should set tooltipForDisabled when caseObjectType is Review on trigger of getServiceParameters',  () => {
    component.caseObject = new CaseObject('1234', 'AA', 'ChangeRequest');
    component.caseObjectType = 'Review';
    component.getServiceParameters();
    expect(component.showDialog).toBe(true);
  });

  it('should set tooltipForDisabled when caseObjectType is ReviewEntry on trigger of getServiceParameters',  () => {
    component.caseObject = new CaseObject('1234', 'AA', 'ChangeRequest');
    component.caseObjectType = 'ReviewEntry';
    component.getServiceParameters();
    expect(component.buttonDisabled).toBe(true);
  });
});
class ServiceParametersServiceMock {
  getCaseObjectMetaData(service: string, category: string) {
    return {};
  }
  getServiceParameter(type: string, category: string, action: string) {
    return  [{type: 'LABEL', label: 'label test'},
      {type: 'TOOLTIP', label: 'tooltip test'},
      {type: 'REQUEST-CONFIRMATION-MESSAGE', label: 'message test'},
      {type: 'NOT-APPLICABLE-HANDLING', name: 'DISABLE'},
      {type: 'TOOLTIP-FOR-DISABLE', label: 'tool tip is disable'}] as Value[];
  }
}
