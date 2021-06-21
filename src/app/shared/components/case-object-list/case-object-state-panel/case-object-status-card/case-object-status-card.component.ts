import {Component, Input, OnInit} from '@angular/core';

import {ReleasePackageStatePanelForm} from '../../../../models/mc-presentation.model';
import {CaseObjectLabelPipe} from '../../../../pipes/case-object-label.pipe';
import {HelpersService} from '../../../../../core/utilities/helpers.service';
import {ConfigurationService} from '../../../../../core/services/configurations/configuration.service';

@Component({
  selector: 'mc-case-object-status-card',
  templateUrl: './case-object-status-card.component.html',
  styleUrls: ['./case-object-status-card.component.scss']
})
export class CaseObjectStatusCardComponent implements OnInit {
  @Input()
  showActionsCount: boolean;
  @Input()
  Status: any;
  @Input()
  caseObjectDetails: ReleasePackageStatePanelForm;

  @Input()
  selectedCardIndex: number;
  @Input()
  expandStatePanel: boolean;

  @Input()
  index: number;
  @Input()
  caseObjectType: string;
  @Input()
  toolTip: string;
  caseObjectStatusLabel: string;
  constructor(private readonly helpersService: HelpersService, private readonly configurationService: ConfigurationService) {
  }

  ngOnInit() {
    const caseObjectPipe = new CaseObjectLabelPipe(this.helpersService, this.configurationService);
    if (this.caseObjectDetails) {
      this.caseObjectStatusLabel = caseObjectPipe.transform(this.caseObjectDetails.caseObjectStatus || this.caseObjectDetails.caseObjectState, this.caseObjectType);
    }
  }
}
