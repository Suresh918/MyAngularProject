import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {of} from 'rxjs';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {StoreModule} from '@ngrx/store';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

import { MCAssessmentWizardCiaComponent } from './mc-assessment-wizard-cia.component';
import {ChangeRequestService} from '../../../change-request/change-request.service';
import {metaReducers, reducers} from '../../../store';
import {ChangeRequestServiceMock} from "../../../change-request/creator/creator-change-request-details/creator-change-request-mock.service";

describe('MCAssessmentWizardCiaComponent', () => {
  let component: MCAssessmentWizardCiaComponent;
  let fixture: ComponentFixture<MCAssessmentWizardCiaComponent>;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of({assessmentAnswers: [
        { ID: '0assessment',
          answer: 'YES',
          answerDetail: 'sada',
          detailID: '0assessmentDetail',
          question: 'Is this a change that introduces a new 11 NC of an existing Equipment Component (i.e. a cabinet or an exposure unit)?'}],
      result: 'None',
      applicabilityCheck: {
        ID: 'test123',
        question: 'test123',
        answerEnumeration: [{label: 'yes', value: 'yes', sequence: 2},
          {label: 'yes', value: 'yes', sequence: 2},
          {label: 'yes', value: 'yes', sequence: 2}]
      }
    }), close: null });

  const dialogMock = {
    open: () => { },
    close: () => { }
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCAssessmentWizardCiaComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatDialogModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [
        { provide: ChangeRequestService, useClass: ChangeRequestServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        FormBuilder
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCAssessmentWizardCiaComponent);
    component = fixture.componentInstance;
    component.CIAControlConfiguration = {};
    component.CIAControlConfiguration['assessmentCriterias'] = { answer : { options: [] }};
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog when PIIAFormGroup is set on openAnalysisDialog is triggered',  () => {
    spyOn(component.dialog, 'open').and.returnValue(dialogRefSpyObj);
    component.CIAFormGroup = new FormGroup({
      assessmentCriterias: new FormArray([
        new FormGroup({answer: new FormControl({value: 'answer'}, []),
          explanation: new FormControl({value: 'explanation'}, []),
          motivation: new FormControl({value: 'motivation'}, []),
          question: new FormControl({value: 'question'}, [])
        }),
        new FormGroup({answer: new FormControl({value: 'answer'}, []),
          explanation: new FormControl({value: 'explanation'}, []),
          motivation: new FormControl({value: 'motivation'}, []),
          question: new FormControl({value: 'question'}, [])
        })
      ]),
      customerImpact: new FormControl('')
    });
    component.answerEnumeration = [{label: 'test label', name: 'test name', section: 'test section', sequence: '1'},
      {label: 'test label', name: 'test name', section: 'test section', sequence: '1'},
      {label: 'test label', name: 'test name', section: 'test section', sequence: '1'},
      {label: 'test label', name: 'test name', section: 'test section', sequence: '1'}];
    component.openAnalysisDialog();
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('should return MAJOR when impact is set as Major on Triggered getImpactResult', () => {
    const returnValue = component.getImpactResult('Major');
    expect(returnValue).toBe('MAJOR');
  });

  it('should return MINOR when impact is set as Minor on Triggered getImpactResult', () => {
    const returnValue = component.getImpactResult('Minor');
    expect(returnValue).toBe('MINOR');
  });

  it('should return NA when impact is set as N/A on Triggered getImpactResult', () => {
    const returnValue = component.getImpactResult('N/A');
    expect(returnValue).toBe('NA');
  });*/
});
