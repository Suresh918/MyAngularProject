import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {ChangeRequestFormConfiguration} from '../../../../../shared/models/mc-configuration.model';
import {CaseObject, ChangeRequest} from '../../../../../shared/models/mc.model';
import {Observable} from 'rxjs';

@Component({
  selector: 'mc-project-change-request-customer-impact',
  templateUrl: './project-change-request-customer-impact.component.html',
  styleUrls: ['./project-change-request-customer-impact.component.scss']
})
export class ProjectChangeRequestCustomerImpactComponent {
  @Input()
  changeRequestFormGroup: FormGroup;
  @Input()
  changeRequestConfiguration: ChangeRequestFormConfiguration;
  @Input()
  isExpanded: boolean;
  @Input()
  showCustomerImpactAlert: boolean;
  @Input()
  caseObject: CaseObject;
  @Input()
  showPartsQuestion: boolean;
  @Input()
  showOtherPartsQuestions: boolean;
  @Input()
  buttonAction$: Observable<boolean>;
  @Input()
  buttonActionScia$: Observable<boolean>;
  @Input()
  readOnlyFields: string[];
  @Input()
  mandatoryFields: string[];
  @Output()
  readonly changeRequestDataChanged: EventEmitter<ChangeRequest> = new EventEmitter();
  public isScmIntegrationEnabled: boolean;
  constructor() {
    this.isScmIntegrationEnabled = window['isScmIntegrationEnabled'];
  }

  changeRequestChanged(event) {
    this.changeRequestDataChanged.emit(event);
  }
}
