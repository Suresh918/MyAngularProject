import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {provideMockStore} from '@ngrx/store/testing';

import {CreatorChangeRequestAnalyzeImpactComponent} from './creator-change-request-analyze-impact.component';
import {RouterModule} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {StoreModule} from '@ngrx/store';
import {metaReducers, reducers} from '../../../../store';
import {ChangeRequestService} from '../../../change-request.service';
import {HelpersService} from '../../../../core/utilities/helpers.service';

import {of} from 'rxjs';

describe('CreatorChangeRequestAnalyzeImpactComponent', () => {
  let component: CreatorChangeRequestAnalyzeImpactComponent;
  let fixture: ComponentFixture<CreatorChangeRequestAnalyzeImpactComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreatorChangeRequestAnalyzeImpactComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, BrowserAnimationsModule, MatDialogModule, RouterModule, RouterTestingModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        FormBuilder,
        provideMockStore(),
        {provide: ChangeRequestService, useClass: ChangeRequestServiceMock},
        {provide: HelpersService, useClass: HelpersServiceMock},
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorChangeRequestAnalyzeImpactComponent);
    component = fixture.componentInstance;
    component.changeRequestFormGroup = new FormGroup({
      id: new FormControl(1),
      testID: new FormControl(''),
      impact_analysis: new FormGroup({
        implementation_ranges: new FormControl('FCO')
      })
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('validator should return the validator value', () => {
    const control = new FormControl('', Validators.compose([Validators.required]));
    expect(component.hasValidator(control)).toBe(true);
  });

  it('validator should return the validator value', () => {
    const control = new FormControl('');
    expect(component.hasValidator(control)).toBe(false);
  });

  it('check for implementation ranges should return the implementationRangesFCOSelected as true if it contains FCO.', () => {
    component.checkForImplementationRanges();
    expect(component.implementationRangesFCOSelected).toBe(true);
  });

  it('Update implementation ranges should return the implementationRangesFCOSelected as true if it contains FCO.', () => {
    const event = {value: ''} as AcceptedChange;
    expect(component.onUpdateImplementationRanges(event)).toBe();

  });

  it('Update implementation ranges should return the implementationRangesFCOSelected as true if it contains FCO.', () => {
    const event = {value: 'test'} as AcceptedChange;
    spyOn(component.implementationRangesUpdated, 'emit');
    component.onUpdateImplementationRanges(event);
    expect(component.implementationRangesUpdated.emit).toHaveBeenCalled();
  });

  it('Update implementation ranges should return the implementationRangesFCOSelected as true if it contains FCO.', () => {
    const event = {value: 'test'} as AcceptedChange;
    spyOn(component.implementationRangesUpdated, 'emit');
    component.onUpdateImplementationRanges(event);
    expect(component.implementationRangesUpdated.emit).toHaveBeenCalled();
  });

  it('update changeRequest form group on field update', () => {
    const event = {
      event: {
        ChangeRequestElement: {},
        FieldElement: [{ID: 'testID', value: 'test'}],
      },
      val: 'testID'
    };
    component.onCheckFieldUpdate(event);
    expect(component.changeRequestFormGroup.get('testID').value).toBe('test');
  });

  it('should trigger change request changed event', () => {
    spyOn(component.changeRequestDataChanged, 'emit');
    component.changeRequestChanged(event);
    expect(component.changeRequestDataChanged.emit).toHaveBeenCalledWith(event);
  });

  it('should trigger toNumber which converts string to number', () => {
    expect(component.toNumber('123')).toBe(123);
  });
});

class ChangeRequestServiceMock {
  updateImplementationRanges() {
    return of({id: 1});
  }
}

class HelpersServiceMock {
  getErrorMessage() {
  }
}

