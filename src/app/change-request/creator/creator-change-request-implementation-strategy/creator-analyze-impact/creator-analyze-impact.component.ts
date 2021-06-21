import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {ChangeRequestFormConfiguration} from '../../../../shared/models/mc-configuration.model';
import {CaseObject, ChangeRequest} from '../../../../shared/models/mc.model';

@Component({
  selector: 'mc-creator-analyze-impact',
  templateUrl: './creator-analyze-impact.component.html',
  styleUrls: ['./creator-analyze-impact.component.scss']
})
export class CreatorAnalyzeImpactComponent {
  @Input()
  set changeRequestFormGroup(formGroup: FormGroup) {
    if (formGroup) {
      this.crFormGroup = formGroup;
      const implementationRanges = formGroup.get('impact_analysis.implementation_ranges').value;
      this.implementationRangesFCOSelected = (implementationRanges ? implementationRanges.indexOf('FCO') > -1 : false);
    }
  }

  get changeRequestFormGroup(): FormGroup {
    return this.crFormGroup;
  }

  @Input()
  changeRequestConfiguration: ChangeRequestFormConfiguration;
  @Input()
  changeRequestData: ChangeRequest;
  @Input()
  fontSize: string;
  @Input()
  isExpanded: string;
  @Input()
  caseObject: CaseObject;
  @Input()
  getLabel: (value) => string;
  @Input()
  getLabelAndDescription: (value, description) => string;
  @Input()
  isUpgradeExpanded: boolean;
  crFormGroup: FormGroup;
  implementationRangesFCOSelected: boolean;

  constructor() {
  }
}
