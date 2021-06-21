import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {select, Store} from '@ngrx/store';
import {Subscription} from 'rxjs';

import {AssessmentCriteria, CaseObject, ChangeRequest} from '../../models/mc.model';
import {ChangeRequestService} from '../../../change-request/change-request.service';
import {loadCaseObject} from '../../../store/actions/case-object.actions';
import {MyChangeState} from '../../models/mc-store.model';
import {MCAssessmentWizardCIAService} from './mc-assessment-wizard-cia.service';
import {FormControlConfiguration, FormControlEnumeration} from '../../models/mc-configuration.model';
import {selectCaseAction, selectReadOnlyFields, selectWriteAllowFields} from '../../../store';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';
import {mcFieldUpdated} from '../../../store/actions/field-update.actions';
import {FieldUpdateData} from '../../models/mc-field-update.model';
import {FieldUpdateStates} from '../../models/mc-enums';

@Component({
  selector: 'mc-assessment-wizard-cia',
  templateUrl: './mc-assessment-wizard-cia.component.html',
  styleUrls: ['./mc-assessment-wizard-cia.component.scss']
})
export class MCAssessmentWizardCiaComponent implements OnInit, OnDestroy {
  @Input()
  CIAFormGroup: FormGroup;
  @Input()
  caseObjectType: string;
  @Input()
  caseObjectId: string;
  @Input()
  caseObjectRevision: string;
  @Input()
  CIAControlConfiguration: FormControlConfiguration;
  answerEnumeration: FormControlEnumeration[];
  aalWizardAssessmentService = new MCAssessmentWizardCIAService();
  saveAllowed: boolean;
  caseObjectSaveAllowed: boolean;
  buttonActionSubscription$: Subscription;
  fieldReadOnlySubscription$: Subscription;
  fieldWriteAllowSubscription$: Subscription;
  fieldID: string;


  constructor(public readonly dialog: MatDialog,
              private readonly changeRequestService: ChangeRequestService,
              private readonly storeHelperService: StoreHelperService,
              private readonly formBuilder: FormBuilder,
              private readonly appStore: Store<MyChangeState>) {
  }

  ngOnInit() {
    this.answerEnumeration = this.CIAControlConfiguration ['assessmentCriterias'].answer.enumeration;
    this.caseObjectRevision = this.caseObjectRevision || 'AA';
    this.fieldID = 'impactAnalysis.customerImpactAnalysis.customerImpact';
    this.initSubscribers();
  }

  initSubscribers(): void {
    if (this.buttonActionSubscription$) {
      this.buttonActionSubscription$.unsubscribe();
    }
    this.buttonActionSubscription$ = this.appStore.pipe(select(selectCaseAction,
      this.storeHelperService.getButtonSelector('ChangeRequest', 'SAVE', this.caseObjectId, this.caseObjectRevision)
    )).subscribe((isAllowed: boolean) => {
      this.caseObjectSaveAllowed = isAllowed;
    });
    this.fieldReadOnlySubscription$ = this.appStore.pipe(select(selectReadOnlyFields)).subscribe((data) => {
      if (data) {
        this.saveAllowed = !(data.indexOf(this.fieldID) > -1);
      }
    });
    this.fieldWriteAllowSubscription$ = this.appStore.pipe(select(selectWriteAllowFields)).subscribe((data) => {
      if (data && data.length > 0) {
        this.saveAllowed = data.indexOf(this.fieldID) > -1;
      }
    });
  }

  openAnalysisDialog(): void {
    let dialogRef: MatDialogRef<AALWizardAssessmentDialogComponent>;
    dialogRef = this.dialog.open(AALWizardAssessmentDialogComponent, {
      width: '55rem',
      data: this.getData(),
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.changeRequestService.updateCustomerImpact$(this.caseObjectId, 'save',
          this.getAssesmentCriteriasPayload(res.assessmentAnswers, res.applicabilityCheck), this.getImpactResult(res.result)).subscribe((response: ChangeRequest) => {
          this.appStore.dispatch(mcFieldUpdated(new FieldUpdateData({
            caseObject: new CaseObject(this.caseObjectId, this.caseObjectRevision, this.caseObjectType),
            fieldId: 'impactAnalysis.customerImpactAnalysis.customerImpact',
            tab: 2,
            mandatoryState: FieldUpdateStates.success
          })));
          this.appStore.dispatch(loadCaseObject({caseObject: response, caseObjectType: this.caseObjectType}));
        });
      }
    });
  }

  getAssesmentCriteriasPayload(assessmentData, applicabilityData) {
    const payloadArray = assessmentData.map((data) => {
      const assessmentCriteria = new AssessmentCriteria();
      assessmentCriteria.question = data.question;
      assessmentCriteria.answer = data.answer;
      assessmentCriteria.motivation = data.answerDetail;
      return assessmentCriteria;
    });
    const applicableCheck = new AssessmentCriteria();
    applicableCheck.question = applicabilityData.question;
    applicableCheck.answer = applicabilityData.answer;
    applicableCheck.motivation = applicabilityData.answerDetail;
    payloadArray.unshift(applicableCheck);
    return payloadArray;
  }

  getData() {
    const assessmentCriteriaData = this.getAssessmentData();
    assessmentCriteriaData.shift();
    return {
      aalWizardAssessmentService: this.aalWizardAssessmentService,
      title: 'CIA',
      applicabilityCheck: this.getAssessmentData()[0],
      assessmentCriteria: assessmentCriteriaData,
      assessmentWizardFormGroup: this.getFormGroup(),
      assessmentResult: this.CIAFormGroup.get('customerImpact').value,
      isSubmitApplicable: this.saveAllowed && this.caseObjectSaveAllowed
    };
  }

  getAssessmentData() {
    const CIAAssessmentCriteria: FormArray = this.CIAFormGroup.get('assessmentCriterias') as FormArray;
    return CIAAssessmentCriteria.controls.map((item, index) => {
      if (index === 0) {
        return new AssessmentQuestion(
          new Info((item as FormGroup).get('explanation').value), // get from service parameters
          this.getID('applicabilityCheck', index),
          (item as FormGroup).get('question').value,
          index,
          [new AnswerEnumeration(this.answerEnumeration[0].label, this.answerEnumeration[0].value as string, 1), // get from Service parameters
            new AnswerEnumeration(this.answerEnumeration[1].label, this.answerEnumeration[1].value  as string, 2),
            new AnswerEnumeration(this.answerEnumeration[2].label, this.answerEnumeration[2].value  as string, 3)],
          'Assessment Criterion Answer',  // get from Service parameters
          'Please justify your answer', // get from Service parameters
          256, // get from Service parameters
          ['YES', 'NO', 'UNKNOWN'],
          this.getID('applicabilityCheck', index, 'Detail'),
          this.saveAllowed && this.caseObjectSaveAllowed,
          ['NO']);
      } else {
        return new AssessmentQuestion(
          new Info((item as FormGroup).get('explanation').value), // get from service parameters
          this.getID('assessmentCriteria', index),
          (item as FormGroup).get('question').value,
          index,
          [new AnswerEnumeration(this.answerEnumeration[0].label, this.answerEnumeration[0].value as string, 1), // get from Service parameters
            new AnswerEnumeration(this.answerEnumeration[1].label, this.answerEnumeration[1].value as string, 2),
            new AnswerEnumeration(this.answerEnumeration[2].label, this.answerEnumeration[2].value as string, 3)],
          'Assessment Criterion Answer',  // get from Service parameters
          'Please justify your answer', // get from Service parameters
          256, // get from Service parameters
          ['YES', 'NO', 'UNKNOWN'],
          this.getID('assessmentCriteria', index, 'Detail'),
          this.saveAllowed && this.caseObjectSaveAllowed && index !== 5);
      }
    });
  }


  getFormGroup(): FormGroup {
    const CIAAssessmentCriteria: FormArray = this.CIAFormGroup.get('assessmentCriterias') as FormArray;
    const PIIADialogFormGroup = this.formBuilder.group({});
    PIIADialogFormGroup.addControl(this.getID('applicabilityCheck', 0), new FormControl((CIAAssessmentCriteria.controls[0] as FormGroup).get('answer').value));
    PIIADialogFormGroup.addControl(this.getID('applicabilityCheck', 0, 'Detail'), new FormControl((CIAAssessmentCriteria.controls[0] as FormGroup).get('motivation').value));
    for (let i = 1; i < CIAAssessmentCriteria.controls.length; i++) {
      PIIADialogFormGroup.addControl(this.getID('assessmentCriteria', i), new FormControl((CIAAssessmentCriteria.controls[i] as FormGroup).get('answer').value));
      PIIADialogFormGroup.addControl(this.getID('assessmentCriteria', i, 'Detail'), new FormControl((CIAAssessmentCriteria.controls[i] as FormGroup).get('motivation').value));
    }
    return PIIADialogFormGroup;
  }

  getID(questionType: string, index?: number, type?: string): string {
    return type === 'Detail' ? ('' + index + (type || '') + questionType) : '' + index + questionType;
  }

  getImpactResult(impact) {
    switch (impact) {
      case 'Major':
        return 'MAJOR';
      case 'Minor':
        return 'MINOR';
      case 'N/A':
        return 'NA';
    }
  }


  ngOnDestroy(): void {
    if (this.buttonActionSubscription$) {
      this.buttonActionSubscription$.unsubscribe();
    }
    if (this.fieldReadOnlySubscription$) {
      this.fieldReadOnlySubscription$.unsubscribe();
    }
    if (this.fieldReadOnlySubscription$) {
      this.fieldWriteAllowSubscription$.unsubscribe();
    }
  }

}
