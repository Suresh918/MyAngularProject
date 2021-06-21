import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {ChangeRequestFormConfiguration} from '../../../../../shared/models/mc-configuration.model';
import {CaseObject, ChangeRequest} from '../../../../../shared/models/mc.model';
import {Observable} from 'rxjs';

@Component({
  selector: 'mc-creator-change-request-customer-impact',
  templateUrl: './creator-change-request-customer-impact.component.html',
  styleUrls: ['./creator-change-request-customer-impact.component.scss']
})
export class CreatorChangeRequestCustomerImpactComponent {
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
  readOnlyFields: string[];
  @Input()
  mandatoryFields: string[];
  @Output()
  readonly changeRequestDataChanged: EventEmitter<ChangeRequest> = new EventEmitter();
  constructor() { }


  changeRequestChanged(event) {
    this.changeRequestDataChanged.emit(event);
  }
}
