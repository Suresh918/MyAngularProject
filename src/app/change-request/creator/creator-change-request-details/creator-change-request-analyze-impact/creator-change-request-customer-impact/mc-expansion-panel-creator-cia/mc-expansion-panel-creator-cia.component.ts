import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ChangeRequestFormConfiguration} from '../../../../../../shared/models/mc-configuration.model';
import {CaseObject, ChangeRequest} from '../../../../../../shared/models/mc.model';
import {ChangeRequestService} from '../../../../../change-request.service';
import {Router} from '@angular/router';

@Component({
  selector: 'mc-expansion-panel-creator-cia',
  templateUrl: './mc-expansion-panel-creator-cia.component.html',
  styleUrls: ['./mc-expansion-panel-creator-cia.component.scss']
})
export class McExpansionPanelCreatorCiaComponent implements OnInit {
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
  }

  openChangeImpactAssessment(changeRequestID): void {
    this.router.navigate([`/change-requests/cr-customer-impact-assessment/${changeRequestID}`]);
  }

  getLabel(ciaValue) {
    if (ciaValue && ciaValue !== '') {
      const ciaEnum = this.changeRequestConfiguration.impact_analysis.customer_impact.customer_impact_result.options;
      return ciaEnum.filter((ciaItem) => ciaItem.value === ciaValue)[0].label;
    }
  }
}
