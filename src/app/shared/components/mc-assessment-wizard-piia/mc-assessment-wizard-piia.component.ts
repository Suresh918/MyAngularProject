import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {select, Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {ChangeRequestService} from '../../../change-request/change-request.service';
import {MyChangeState} from '../../models/mc-store.model';
import {loadCaseObject} from '../../../store/actions/case-object.actions';
import {AssessmentCriteria, CaseObject, ChangeRequest} from '../../models/mc.model';
import {McAssessmentWizardPiiaService} from './mc-assessment-wizard-piia.service';
import {selectCaseAction, selectReadOnlyFields, selectWriteAllowFields} from '../../../store';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';
import {mcFieldUpdated} from '../../../store/actions/field-update.actions';
import {FieldUpdateData} from '../../models/mc-field-update.model';
import {FieldUpdateStates} from '../../models/mc-enums';
import {FormControlConfiguration, FormControlEnumeration} from '../../models/mc-configuration.model';

@Component({
  selector: 'mc-assessment-wizard-piia',
  templateUrl: './mc-assessment-wizard-piia.component.html',
  styleUrls: ['./mc-assessment-wizard-piia.component.scss']
})
export class MCAssessmentWizardPiiaComponent implements OnInit, OnDestroy {
  @Input()
  PIIAFormGroup: FormGroup;
  @Input()
  caseObjectType: string;
  @Input()
  caseObjectRevision: string;
  @Input()
  caseObjectId: string;
  @Input()
  PIIAControlConfiguration: FormControlConfiguration;
  aalWizardAssessmentService = new McAssessmentWizardPiiaService();
  answerEnumeration: FormControlEnumeration[];
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
    this.answerEnumeration = this.PIIAControlConfiguration['impact'].options;
    this.caseObjectRevision = this.caseObjectRevision || 'AA';
    this.fieldID = this.PIIAControlConfiguration.ID;
    this.initSubscribers();
  }

  initSubscribers(): void {
    if (this.buttonActionSubscription$) {
      this.buttonActionSubscription$.unsubscribe();
    }
    this.buttonActionSubscription$ = this.appStore.pipe(select(selectCaseAction,
      this.storeHelperService.getButtonSelector('ChangeRequest', 'SAVE',
        this.caseObjectId, this.caseObjectRevision)
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
      width: '70rem',
      data: this.getData(),
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.changeRequestService.updatePreInstallImpact$(this.caseObjectId, 'save',
          this.getAssesmentCriteriasPayload(res.assessmentAnswers), this.getImpactResult(res.result)).subscribe((response: ChangeRequest) => {
          this.appStore.dispatch(mcFieldUpdated(new FieldUpdateData({
            caseObject: new CaseObject(this.caseObjectId, this.caseObjectRevision, this.caseObjectType),
            fieldId: 'impactAnalysis.preInstallImpactAnalysis.preInstallImpact',
            tab: 2,
            mandatoryState: FieldUpdateStates.success
          })));
          this.appStore.dispatch(loadCaseObject({caseObject: response, caseObjectType: this.caseObjectType}));
        });
      }
    });
  }


  getAssesmentCriteriasPayload(assessmentData) {
    return assessmentData.map((data) => {
      const assessmentCriteria = new AssessmentCriteria();
      assessmentCriteria.question = data.question;
      assessmentCriteria.answer = data.answer;
      assessmentCriteria.motivation = data.answerDetail;
      return assessmentCriteria;
    });
  }

  getData() {
    const PIIAAssessmentCriteria: FormArray = this.PIIAFormGroup.get('assessmentCriterias') as FormArray;
    const data = {
      aalWizardAssessmentService: this.aalWizardAssessmentService,
      title: 'PIIA',
      assessmentCriteria: PIIAAssessmentCriteria.controls.map((item, index) => {
        return new AssessmentQuestion(
          new Info((item as FormGroup).get('explanation').value), // get from service parameters
          this.getID(index),
          (item as FormGroup).get('question').value,
          index,
          [new AnswerEnumeration(this.answerEnumeration[0].label, this.answerEnumeration[0].value as string, 1), // get from Service parameters
            new AnswerEnumeration(this.answerEnumeration[1].label, this.answerEnumeration[1].value  as string, 2)],
          'Assessment Criterion Answer',  // get from Service parameters
          'Please justify your answer', // get from Service parameters
          256, // get from Service parameters
          ['YES', 'NO', 'UNKNOWN'],
          this.getID(index, 'Detail'),
          this.saveAllowed && this.caseObjectSaveAllowed);
      }),
      assessmentWizardFormGroup: this.getFormGroup(),
      assessmentResult: this.PIIAFormGroup.get('preInstallImpact').value,
      isSubmitApplicable: this.saveAllowed && this.caseObjectSaveAllowed
    };
    return data;
  }

  getFormGroup(): FormGroup {
    const PIIAAssessmentCriteria: FormArray = this.PIIAFormGroup.get('assessmentCriterias') as FormArray;
    const PIIADialogFormGroup = this.formBuilder.group({});
    PIIAAssessmentCriteria.controls.forEach((item, index) => {
      PIIADialogFormGroup.addControl(this.getID(index), new FormControl((item as FormGroup).get('answer').value));
      PIIADialogFormGroup.addControl(this.getID(index, 'Detail'), new FormControl((item as FormGroup).get('motivation').value));
    });
    return PIIADialogFormGroup;
  }

  getID(index: number, type?: string): string {
    return type === 'Detail' ? '' + index + 'assessment' + type : '' + index + 'assessment';
  }

  getImpactResult(impact) {
    switch (impact) {
      case 'None':
        return 'NONE';
      case 'Yes':
        return 'YES';
      case 'Unknown':
        return 'UNKNOWN';
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
