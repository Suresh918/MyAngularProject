import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {ChangeRequestFormConfiguration} from '../../../../../../shared/models/mc-configuration.model';
import {CaseObject, ChangeRequest} from '../../../../../../shared/models/mc.model';
import {ChangeRequestService} from '../../../../../change-request.service';
import {Router} from '@angular/router';
import {CaseObjectServicePath} from '../../../../../../shared/components/case-object-list/case-object.enum';

@Component({
  selector: 'mc-expansion-panel-project-cia',
  templateUrl: './mc-expansion-panel-project-cia.component.html',
  styleUrls: ['./mc-expansion-panel-project-cia.component.scss']
})
export class McExpansionPanelProjectCiaComponent implements OnInit {
  @Input()
  changeRequestFormGroup: FormGroup;
  @Input()
  changeRequestConfiguration: ChangeRequestFormConfiguration;
  @Input()
  isExpanded: boolean;
  @Input()
  caseObject: CaseObject;
  @Input()
  showPartsQuestion: boolean;
  @Input()
  showOtherPartsQuestions: boolean;
  @Input()
  showCustomerImpactAlert: boolean;
  @Input()
  readOnlyFields: string[];
  @Input()
  questionsList: string[];
  @Input()
  mandatoryFields: string[];
  @Output()
  readonly changeRequestDataChanged: EventEmitter<ChangeRequest> = new EventEmitter();
  descriptionOptions: string[];
  ciaMandatoryFieldsAdded: boolean;
  impactAssesmentControls = ['impact_analysis.customer_impact.impact_on_user_interfaces', 'impact_analysis.customer_impact.impact_on_wafer_process_environment', 'impact_analysis.customer_impact.change_to_customer_impact_critical_part'
  , 'impact_analysis.customer_impact.change_to_process_impacting_customer', 'impact_analysis.customer_impact.fco_upgrade_option_csr_implementation_change'];


  constructor(private readonly changeRequestService: ChangeRequestService,
              private readonly router: Router) {
    this.descriptionOptions = ['YES', 'NO'];
  }

  ngOnInit() {
    this.ciaMandatoryFieldsAdded = false;
    this.getCIAFieldBooleans();
  }

  getCIADependentFieldState(event?) {
    if (event && event.id) {
      let updatedCRData = JSON.parse(JSON.stringify(this.changeRequestFormGroup.getRawValue()));
      let impactAnalysis = JSON.parse(JSON.stringify(updatedCRData.impact_analysis));
      impactAnalysis = {...impactAnalysis, ...event};
      updatedCRData = {...updatedCRData, impact_analysis: impactAnalysis};
      this.changeRequestDataChanged.emit(updatedCRData);
      this.getCIAFieldBooleans();
    }
  }

  getCIAFieldBooleans() {
    if (this.changeRequestFormGroup.get('id').value) {
      this.changeRequestService.getCIADependentFieldState$(this.changeRequestFormGroup.get('id').value, CaseObjectServicePath[this.caseObject.type])
        .subscribe(res => {
          this.showPartsQuestion = res['show_existing_part_question'];
          this.showOtherPartsQuestions = res['show_other_questions'];
          this.setValidations();
        });
    }
  }

  setValidations() {
    if (this.showPartsQuestion && this.changeRequestFormGroup.get('status').value !== 2) {
      this.changeRequestFormGroup.get('impact_analysis.impact_on_existing_parts').setValidators(Validators.required);
    } else {
      this.changeRequestFormGroup.get('impact_analysis.impact_on_existing_parts').setValidators([]);
    }
    const impactAssessmentControls = this.impactAssesmentControls;
    if (this.showOtherPartsQuestions) {
      this.setMandatoryParameters(impactAssessmentControls, 'add');
      this.impactAssesmentControls.forEach(control => {
        this.changeRequestFormGroup.get(control).setValidators(Validators.required);
        this.changeRequestFormGroup.get(control).updateValueAndValidity();
      });
    } else {
      this.setMandatoryParameters(impactAssessmentControls, 'remove');
      this.impactAssesmentControls.forEach(control => {
        this.changeRequestFormGroup.get(control).setValidators([]);
        this.changeRequestFormGroup.get(control).updateValueAndValidity();
      });
    }
  }

  setMandatoryParameters(questionKeys: string[], mode) {
    if (mode === 'add' && !this.ciaMandatoryFieldsAdded) {
      this.ciaMandatoryFieldsAdded = true;
      this.mandatoryFields.push(...questionKeys);
    } else if (mode === 'remove' && this.ciaMandatoryFieldsAdded) {
      this.ciaMandatoryFieldsAdded = false;
      questionKeys.forEach((questionKey) => {
        this.mandatoryFields.forEach((mandatoryField, index) => {
          if (questionKey === mandatoryField) {
            this.mandatoryFields.splice(index, 1);
          }
        });
      });
    }
  }

  openChangeImpactAssessment(changeRequestID): void {
    this.router.navigate([`/change-requests/cr-customer-impact-assessment/${changeRequestID}`]);
  }

  reInitializeFormGroup(event) {
    if (event && event.id) {
      let updatedCRData = JSON.parse(JSON.stringify(this.changeRequestFormGroup.getRawValue()));
      let impactAnalysis = JSON.parse(JSON.stringify(updatedCRData.impact_analysis));
      impactAnalysis = {...impactAnalysis, customer_impact: event};
      updatedCRData = {...updatedCRData, impact_analysis: impactAnalysis};
      this.changeRequestDataChanged.emit(updatedCRData);
    }
  }

  getLabel(ciaValue) {
    if (ciaValue && ciaValue !== '') {
      const ciaEnum = this.changeRequestConfiguration.impact_analysis.customer_impact.customer_impact_result.options;
      return ciaEnum.filter((ciaItem) => ciaItem.value === ciaValue)[0].label;
    }
  }
}
