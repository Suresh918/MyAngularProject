import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {select, Store} from '@ngrx/store';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {MCFormGroupService} from '../../../../core/utilities/mc-form-group.service';
import {ServiceParametersService} from '../../../../core/services/service-parameters.service';
import {AgendaCBRule, AgendaCBRuleSet, CBRuleSet} from '../../../models/mc-presentation.model';
import {ManageCbRulesService} from '../../../../core/services/manage-cb-rules.service';
import {
  ChangeRequestFormConfiguration,
  FormControlConfiguration,
  FormControlEnumeration,
  RuleSetFormConfiguration
} from '../../../models/mc-configuration.model';
import {selectCaseAction} from '../../../../store';
import {MyChangeState} from '../../../models/mc-store.model';
import {StoreHelperService} from '../../../../core/utilities/store-helper.service';
import {ConfigurationService} from '../../../../core/services/configurations/configuration.service';
import {ChangeRequestService} from '../../../../change-request/change-request.service';

@Component({
  selector: 'mc-cb-rules-dialog',
  templateUrl: './cb-rules-dialog.component.html',
  styleUrls: ['./cb-rules-dialog.component.scss'],
  providers: [ChangeRequestService]
})
export class CbRulesDialogComponent implements OnInit {
  title: string;
  selectedCBRuleSet: CBRuleSet;
  totalRuleSets: AgendaCBRuleSet[];
  rulesForSelectedRuleSet: AgendaCBRule[];
  cbRuleSetFormControl: FormControl;
  cbRuleSetControlConfiguration: RuleSetFormConfiguration;
  ruleSetControlEnumeration: FormControlEnumeration[];
  changeRequestConfiguration: ChangeRequestFormConfiguration;
  cbRulesSaveAction$: Observable<boolean>;
  saveCaseAction: string;
  cbRulesStatus: string;
  totalCountCbRulesSelected: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private readonly mcFormGroupService: MCFormGroupService,
              private readonly serviceParametersService: ServiceParametersService,
              public readonly dialogRef: MatDialogRef<CbRulesDialogComponent>,
              private readonly  manageCbRulesService: ManageCbRulesService,
              private readonly changeRequestService: ChangeRequestService,
              private readonly configurationService: ConfigurationService,
              private readonly storeHelperService: StoreHelperService,
              private readonly appStore: Store<MyChangeState>) {
    this.title = data.title;
    this.cbRulesStatus = data.cbRulesStatus;
    this.selectedCBRuleSet = (data.cbRulesSetSelectedDialog) ? JSON.parse(JSON.stringify(data.cbRulesSetSelectedDialog)) : '';
    this.totalCountCbRulesSelected = (this.selectedCBRuleSet.rules) ? this.selectedCBRuleSet.rules.length : 0;
    this.cbRuleSetFormControl = new FormControl('');
    this.changeRequestConfiguration = this.configurationService.getFormFieldParameters('ChangeRequest2.0') as ChangeRequestFormConfiguration;
    this.cbRuleSetControlConfiguration = this.changeRequestConfiguration.change_board_rule_set;
    this.ruleSetControlEnumeration = [];
    this.rulesForSelectedRuleSet = [];
  }

  ngOnInit() {
    this.subscribeToCaseAction();
    this.getTotalCBRulesSetData();
    this.saveCaseAction = (this.data.type === 'AgendaItem') ? 'UPDATE-AGENDAITEM-CB-RULESET' : 'UPDATE_CHANGE_REQUEST_CB_RULESET';
  }

  getTotalCBRulesSetData() {
    let ruleSet;
    this.manageCbRulesService.getCBRuleset().subscribe((data: AgendaCBRuleSet[]) => {
      if (data) {
        this.totalRuleSets = data;
          this.totalRuleSets.forEach(value => {
            ruleSet = {'label': value.label, 'value': value.name.trim()} as FormControlEnumeration;
            this.ruleSetControlEnumeration.push(ruleSet);
          });
        this.ruleSetControlEnumeration.sort((a, b) => (a.label.trim() > b.label.trim()) ? 1 : ((b.label.trim() > a.label.trim()) ? -1 : 0));
        this.setSelectedRuleSet();
        this.setSelectedRules();
      }
    }, () => {
    });
  }

  setSelectedRuleSet() {
    this.cbRuleSetControlConfiguration.options = this.ruleSetControlEnumeration;
    this.cbRuleSetFormControl.setValue(this.selectedCBRuleSet.rule_set_name);
  }

  subscribeToCaseAction() {
    this.cbRulesSaveAction$ = this.appStore.pipe(select(selectCaseAction,
      this.storeHelperService.getButtonSelector(this.data.type, (this.data.type === 'AgendaItem') ? 'UPDATE-AGENDAITEM-CB-RULESET' : (this.data.type === 'AgendaItem') ? 'UPDATE-AGENDAITEM-CB-RULESET' : 'UPDATE_CHANGE_REQUEST_CB_RULESET',
        this.data.Id, (this.data.revision) ? this.data.revision : '')
    ));
  }

  setRulesForSelectedRuleSet() {
    const ruleSetData = this.totalRuleSets.filter((item) => item.name === this.cbRuleSetFormControl.value)[0];
    // creates new instance of object
    const rulesetConfiguration = JSON.parse(JSON.stringify(this.cbRuleSetControlConfiguration));
    rulesetConfiguration.help = (ruleSetData.help) ? ruleSetData.help : '';
    this.cbRuleSetControlConfiguration = rulesetConfiguration;
    this.rulesForSelectedRuleSet = ruleSetData.rules;
    this.rulesForSelectedRuleSet.forEach((rule) => rule['selected'] = false);
  }


  setSelectedRules() {
    if (this.selectedCBRuleSet.rule_set_name) {
      this.setRulesForSelectedRuleSet();
      if (this.selectedCBRuleSet.rules) {
        this.selectRules();
      }
    }
  }

  selectRules() {
    let index;
    this.selectedCBRuleSet.rules.forEach(selectedRule => {
      index = this.rulesForSelectedRuleSet.findIndex((rule) => (rule.label === selectedRule || rule.name === selectedRule));
      if (this.rulesForSelectedRuleSet[index]) {
        this.rulesForSelectedRuleSet[index].selected = true;
      }
    });
  }

  onSelectRule(selectedRule: AgendaCBRule, event) {
    selectedRule.selected = event.checked;
    this.totalCountCbRulesSelected = this.rulesForSelectedRuleSet.filter((rule) => rule.selected).map(rule => rule.name).length;
  }

  onClickSaveCBRuleSet() {
    const ruleSetToSave = {
      rule_set_name: this.cbRuleSetFormControl.value,
      rules: this.rulesForSelectedRuleSet.filter((rule) => rule.selected).map(rule => rule.name)
    } as CBRuleSet;
    if (this.data.type === 'ChangeRequest') {
      delete this.selectedCBRuleSet['rulesHelp'];
      this.changeRequestService.updateCBRuleSetForCr(this.selectedCBRuleSet, ruleSetToSave, this.data.Id).subscribe(res => {
        this.dialogRef.close(res);
      });
    } else {
      ruleSetToSave.name = this.cbRuleSetFormControl.value;
      delete ruleSetToSave.rule_set_name;
      this.manageCbRulesService.updateCBRuleSet(ruleSetToSave, this.data.Id, this.saveCaseAction, this.data.type).subscribe(response => {
        this.dialogRef.close(response);
      });
    }
  }

  cancel() {
    this.dialogRef.close(this.selectedCBRuleSet);
  }
}
