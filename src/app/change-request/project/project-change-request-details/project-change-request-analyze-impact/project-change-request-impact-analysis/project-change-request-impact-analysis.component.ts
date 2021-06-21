import {Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {select, Store} from '@ngrx/store';

import {ChangeRequestFormConfiguration} from '../../../../../shared/models/mc-configuration.model';
import {ChangeRequest} from '../../../../../shared/models/mc.model';
import {Observable} from 'rxjs';
import {MyChangeState} from '../../../../../shared/models/mc-store.model';
import {StoreHelperService} from '../../../../../core/utilities/store-helper.service';
import {selectCaseAction} from '../../../../../store';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MCConversationDialogComponent} from '../../../../../shared/components/mc-conversation-dialog/mc-conversation-dialog.component';
import {MCAssessmentDialogPIIAComponent} from '../../../../../shared/components/mc-assessment-dialog-piia/mc-assessment-dialog-piia.component';

@Component({
  selector: 'mc-project-change-request-impact-analysis',
  templateUrl: './project-change-request-impact-analysis.component.html',
  styleUrls: ['./project-change-request-impact-analysis.component.scss']
})
export class ProjectChangeRequestImpactAnalysisComponent implements OnInit, OnChanges {
  impactOnSequenceShowDesForOptions: string[];
  techRiskAssessFMEAShowDesForOptions: string[];
  techRiskAssessSRShowDesForOptions: string[];
  phaseOutSparesToolsShowDesForOptions: string[];
  impactOnAvailabilityShowDesForOptions: string[];
  sysLevelPerformImpactShowDesForOptions: string[];
  impactOnCycleTimeDetailsShowDesForOptions: string[];
  CBPStrategiesDetailsShowDescForOptions: string[];
  optionDisablesOtherOptionsOfImplementationRange: string[];
  optionDisablesOtherOptionsOfLiabilityRisk: string[];
  pattern: RegExp;
  @Input()
  changeRequestFormGroup: FormGroup;
  @Input()
  changeRequestConfiguration: ChangeRequestFormConfiguration;
  @Input()
  implementationRangesSaveInProgress: boolean;
  @Input()
  implementationRangesUpdateError: Info;
  @Input()
  implementationRangesFCOSelected: boolean;
  @Input()
  changeRequestData: ChangeRequest;
  @Input()
  isUpgradeExpanded?: boolean;
  showFCOField: boolean;
  buttonAction$: Observable<boolean>;
  @Output()
  readonly updateImplementationRangesImpactAnalysis: EventEmitter<AcceptedChange> = new EventEmitter<AcceptedChange>();
  @Output()
  readonly fieldUpdateImpactAnalysis: EventEmitter<any> = new EventEmitter<any>();
  isExpandedSelected: boolean;
  previousValue: string;

  constructor(public readonly appStore: Store<MyChangeState>,
              private readonly matDialog: MatDialog,
              private readonly storeHelperService: StoreHelperService) {
    this.previousValue = '';
  }
  get isExpanded(): boolean {
    return this.isExpandedSelected;
  }

  @Input()
  set isExpanded(value: boolean) {
    this.isExpandedSelected = value;
    this.isUpgradeExpanded = value;
  }

  ngOnInit() {
    this.impactOnSequenceShowDesForOptions = ['YES'];
    this.techRiskAssessFMEAShowDesForOptions = ['NO'];
    this.techRiskAssessSRShowDesForOptions = ['NO'];
    this.phaseOutSparesToolsShowDesForOptions = ['BALANCE-TIMING-AND-COST'];
    this.impactOnAvailabilityShowDesForOptions = ['INCREASE', 'DECREASE'];
    this.sysLevelPerformImpactShowDesForOptions = ['YES'];
    this.impactOnCycleTimeDetailsShowDesForOptions = ['YES'];
    this.CBPStrategiesDetailsShowDescForOptions = [];
    this.optionDisablesOtherOptionsOfImplementationRange = ['NA'];
    this.optionDisablesOtherOptionsOfLiabilityRisk = ['NA'];
    this.changeLeadingValidation();
    this.changeTargetedVCValidation();
    if (this.changeRequestConfiguration.impact_analysis.cbp_strategies.options && this.changeRequestConfiguration.impact_analysis.cbp_strategies.options.length > 0) {
      this.changeRequestConfiguration.impact_analysis.cbp_strategies.options.forEach(item => {
        if (item.value !== 'NA') {
          this.CBPStrategiesDetailsShowDescForOptions.push(item.value);
        }
      });
    }
    // this.pattern = /^\d(\d*)(yr|YR|Yr|yR)?\s*(\d*)(mo|MO|Mo|mO)?\s*(\d*)([dD]?)\s*(?![0-9])$|^[0-9]*$/;
    this.pattern = /^\d((\d*)(yr|YR|Yr|yR))?\s*((\d+)(mo|MO|Mo|mO))?\s*((\d+)[dD])?\s*(?![0-9])$|^[0-9]*$/;
  }


  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.changeRequestFormGroup && simpleChanges.changeRequestFormGroup.currentValue) {
      this.updateFCOField(this.changeRequestFormGroup.get('impact_analysis.implementation_ranges').value);
      this.handleFCOField();
      if (simpleChanges.changeRequestFormGroup.currentValue.value && simpleChanges.changeRequestFormGroup.currentValue.value.ID) {
        this.initSubscribers();
      }
    }
  }

  handleFCOField(): void {
    this.changeRequestFormGroup.get('impact_analysis.implementation_ranges').valueChanges.subscribe(implementationRanges => {
      this.updateFCOField(implementationRanges);
    });
  }

  updateFCOField(implementationRanges: string[]): void {
    if (implementationRanges && implementationRanges.length > 0 && implementationRanges.indexOf('FCO') > -1) {
      this.showFCOField = true;
    } else {
      this.showFCOField = false;
      this.changeRequestFormGroup.get('impact_analysis.fco_types').setValue([]);
    }
  }


  initSubscribers(): void {
    this.buttonAction$ = this.appStore.pipe(select(selectCaseAction,
      this.storeHelperService.getButtonSelector('ChangeRequest', 'SAVE',
        this.changeRequestFormGroup.get('id').value, this.changeRequestFormGroup.get('revision').value)
    ));
  }

  onUpdateImplementationRangesImpactAnalysis($event) {
    this.updateImplementationRangesImpactAnalysis.emit($event);
  }

  onFieldUpdateImpactAnalysis($event, value) {
    const fieldUpdate = {event: $event, val: value};
    this.fieldUpdateImpactAnalysis.emit(fieldUpdate);
  }

  openAnalysisDialog() {
    this.previousValue = this.changeRequestFormGroup.get('impact_analysis.preinstall_impact.preinstall_impact_result').value;
    let dialogRef: MatDialogRef<MCAssessmentDialogPIIAComponent>;
    dialogRef = this.matDialog.open(MCAssessmentDialogPIIAComponent, {
      width: '70rem',
      data: {
        piiaFormGroup : this.changeRequestFormGroup.get('impact_analysis.preinstall_impact'),
        piiaFormConfiguration : this.changeRequestConfiguration.impact_analysis.preinstall_impact,
        caseObjectId: this.changeRequestFormGroup.get('id').value
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.changeRequestFormGroup.get('impact_analysis.preinstall_impact.preinstall_impact_result').setValue(result);
      } else {
        this.changeRequestFormGroup.get('impact_analysis.preinstall_impact.preinstall_impact_result').setValue(this.previousValue);
      }
    });
  }

  changeLeadingValidation() {
    if (this.changeRequestFormGroup.get('impact_analysis.cbp_strategies').value.includes('NA') && !(this.changeRequestFormGroup.get('impact_analysis.cbp_strategies').value.length > 1)) {
      this.changeRequestFormGroup.get('impact_analysis.calendar_dependency').setValidators([]);
      this.changeRequestFormGroup.get('impact_analysis.calendar_dependency').setValue(null);
      this.changeRequestFormGroup.get('impact_analysis.targeted_valid_configurations').setValidators([]);
      this.changeRequestFormGroup.get('impact_analysis.targeted_valid_configurations').setValue(null);
    } else {
      this.changeRequestFormGroup.get('impact_analysis.calendar_dependency').setValidators(Validators.required);
    }
  }

  changeTargetedVCValidation(event?) {
    if (this.changeRequestFormGroup.get('impact_analysis.calendar_dependency').value === 'LEADING') {
      this.changeRequestFormGroup.get('impact_analysis.targeted_valid_configurations').setValidators(Validators.required);
    } else {
      this.changeRequestFormGroup.get('impact_analysis.targeted_valid_configurations').setValidators([]);
    }
  }
}
