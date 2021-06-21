import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StoreModule} from '@ngrx/store';
import {of, Subscription} from 'rxjs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { MCAssessmentWizardPiiaComponent } from './mc-assessment-wizard-piia.component';
import {ChangeRequestService} from '../../../change-request/change-request.service';
import {metaReducers, reducers} from '../../../store';
import {ChangeRequestServiceMock} from '../../../change-request/creator/creator-change-request-details/creator-change-request-mock.service';

describe('MCAssessmentWizardPiiaComponent', () => {
  let component: MCAssessmentWizardPiiaComponent;
  let fixture: ComponentFixture<MCAssessmentWizardPiiaComponent>;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of({assessmentAnswers: [
        { ID: '0assessment',
          answer: 'YES',
          answerDetail: 'sada',
          detailID: '0assessmentDetail',
          question: 'Is this a change that introduces a new 11 NC of an existing Equipment Component (i.e. a cabinet or an exposure unit)?'}],
      result: 'None'}), close: null });

  const dialogMock = {
    open: () => { },
    close: () => { }
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCAssessmentWizardPiiaComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatDialogModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule, StoreModule.forRoot(reducers, {metaReducers})],
      providers: [FormBuilder,
        { provide: ChangeRequestService, useClass: ChangeRequestServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCAssessmentWizardPiiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    component.buttonActionSubscription$ = new Subscription();
    expect(component).toBeTruthy();
  });

  it('should return assessmentCriteria date when triggered getAssesmentCriteriasPayload', () => {
    const assessmentData = [
      { ID: '0assessment',
        answer: 'YES',
        answerDetail: 'sada',
        detailID: '0assessmentDetail',
        question: 'Is this a change that introduces a new 11 NC of an existing Equipment Component (i.e. a cabinet or an exposure unit)?'}];
    const returnValue = component.getAssesmentCriteriasPayload(assessmentData);
    expect(returnValue).toEqual([{'question': 'Is this a change that introduces a new ' +
        '11 NC of an existing Equipment Component (i.e. a cabinet or an exposure unit)?', 'answer': 'YES', 'motivation': 'sada'}]);
  });

  it('should open dialog when PIIAFormGroup is set on openAnalysisDialog is triggered',  () => {
    spyOn(component.dialog, 'open').and.returnValue(dialogRefSpyObj);
    component.PIIAFormGroup = new FormGroup({
      assessmentCriterias: new FormArray([
        new FormGroup({answer: new FormControl({value: 'answer'}, []),
          explanation: new FormControl({value: 'explanation'}, []),
          motivation: new FormControl({value: 'motivation'}, []),
          question: new FormControl({value: 'question'}, [])
        })
      ]),
      preInstallImpact: new FormControl('')
    });
    component.openAnalysisDialog();
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('should return NONE when impact is set as None on Triggered getImpactResult', () => {
    const returnValue = component.getImpactResult('None');
    expect(returnValue).toBe('NONE');
  });

  it('should return YES when impact is set as Yes on Triggered getImpactResult', () => {
    const returnValue = component.getImpactResult('Yes');
    expect(returnValue).toBe('YES');
  });

  it('should return UNKNOWN when impact is set as Unknown on Triggered getImpactResult', () => {
    const returnValue = component.getImpactResult('Unknown');
    expect(returnValue).toBe('UNKNOWN');
  });*/
});
