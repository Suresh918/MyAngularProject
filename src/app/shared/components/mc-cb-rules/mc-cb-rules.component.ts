import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

import {CbRulesDialogComponent} from './cb-rules-dialog/cb-rules-dialog.component';
import {AgendaCBRuleSet, CBRuleSet} from '../../models/mc-presentation.model';
import {CaseObject} from '../../models/mc.model';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';

@Component({
  selector: 'mc-cb-rules',
  templateUrl: './mc-cb-rules.component.html',
  styleUrls: ['./mc-cb-rules.component.scss']
})
export class McCbRulesComponent implements OnChanges {
  @Input()
  cbRulesDataDetails: CBRuleSet;
  @Input()
  caseObject: CaseObject;
  @Input()
  Id: string;
  @Input()
  cbRulesStatus: string;
  @Input()
  type: string;
  @Input()
  showButton: boolean;
  @Input()
  isDisabled: boolean;
  @Input()
  revision: string;
  @Input()
  buttonCaseAction: string;
  @Output()
  readonly cbRulesUpdated: EventEmitter<void> = new EventEmitter<void>();
  ruleSets: AgendaCBRuleSet[];

  constructor(public readonly dialog: MatDialog,
              private readonly serviceParametersService: ServiceParametersService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setHelpText();
  }
  onPressCBRules() {
    const cbRulesSetSelectedData = this.cbRulesDataDetails;
    const cbRulesDialogRef: MatDialogRef<CbRulesDialogComponent>
      = this.dialog.open(CbRulesDialogComponent, {
      width: '70rem',
      data: {
        'title': 'CB Rules',
        'cbRulesSetSelectedDialog': cbRulesSetSelectedData,
        'Id': this.Id,
        'cbRulesStatus': this.cbRulesStatus,
        'type': this.type,
        'revision': this.revision,
        'caseObject': this.caseObject
      }
    });
    cbRulesDialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.cbRulesDataDetails = data;
        this.setHelpText();
        this.cbRulesUpdated.emit();
      }
    });
  }

  setHelpText() {
    if (this.cbRulesDataDetails && this.cbRulesDataDetails.rules && this.cbRulesDataDetails.rules.length > 0) {
      if (!this.cbRulesDataDetails['rulesHelp']) {
        this.cbRulesDataDetails['rulesHelp'] = [];
        this.cbRulesDataDetails.rules.forEach((rule) => {
          this.cbRulesDataDetails['rulesHelp'].push('');
        });
      }
    }
  }
}
