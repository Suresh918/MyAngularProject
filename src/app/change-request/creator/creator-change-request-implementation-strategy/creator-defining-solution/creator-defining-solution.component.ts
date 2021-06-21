import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {CaseObject, ChangeRequest} from '../../../../shared/models/mc.model';
import {ChangeRequestFormConfiguration} from '../../../../shared/models/mc-configuration.model';

@Component({
  selector: 'mc-creator-defining-solution',
  templateUrl: './creator-defining-solution.component.html',
  styleUrls: ['./creator-defining-solution.component.scss']
})
export class CreatorDefiningSolutionComponent {
  @Input()
  changeRequestFormGroup: FormGroup;
  @Input()
  changeRequestConfiguration: ChangeRequestFormConfiguration;
  @Input()
  changeRequestData: ChangeRequest;
  @Input()
  fontSize: string;
  @Input()
  pictureUrl: string;
  @Input()
  isExpanded: boolean;
  @Input()
  AIRItems: any[];
  @Input()
  PBSItem: any[];
  @Input()
  caseObject: CaseObject;
  @Input()
  getLabel: (value) => string;
  @Input()
  getLabelAndDescription: (value, description) => string;

  constructor() {
  }
}
