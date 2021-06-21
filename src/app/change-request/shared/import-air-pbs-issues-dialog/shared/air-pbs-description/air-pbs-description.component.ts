import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {FormControlConfiguration} from '../../../../../shared/models/mc-configuration.model';
import {ConfigurationService} from '../../../../../core/services/configurations/configuration.service';

@Component({
  selector: 'mc-air-pbs-description',
  templateUrl: './air-pbs-description.component.html',
  styleUrls: ['./air-pbs-description.component.scss']
})
export class AirPbsDescriptionComponent implements OnInit {
  @Input()
  issueItem?: any;
  @Input()
  itemIndex: number;
  @Input()
  showAddButton = false;
  @Input()
  showRemoveButton = false;
  @Input()
  showDropDown = false;
  @Input()
  importingData: boolean;
  @Input()
  portationFormGroup: FormGroup;
  @Input()
  listIndex: number;
  @Input()
  allowNavigation = true;
  @Input()
  showTooltip = true;
  @Input()
  set importContentFormConfiguration(configuration: FormControlConfiguration) {
    this.importDataSelectConfiguration = JSON.parse(JSON.stringify(configuration));
    this.importDataSelectConfiguration.placeholder = this.getControlPlaceholder();
  }
  @Output() readonly addIssueEvent: EventEmitter<any> = new EventEmitter();
  @Output() readonly deleteIssueEvent: EventEmitter<number> = new EventEmitter();
  actionDropDown: any;
  deepLinkURLForAIR: string;
  deepLinkURLForPBS: string;
  importDataSelectConfiguration: FormControlConfiguration;

  constructor(public readonly configurationService: ConfigurationService) {
  }

  ngOnInit() {
    if (!this.issueItem) {
      this.issueItem = this.portationFormGroup.getRawValue();
    }
    this.setDefaultAction();
    this.deepLinkURLForAIR = this.configurationService.getLinkUrl('AIR');
    this.deepLinkURLForPBS = this.configurationService.getLinkUrl('PBS');
  }

  getControlPlaceholder() {
    const numberToWordPipe = new AALNumberPipe();
    return `${numberToWordPipe.transform(this.listIndex, 'to-word')} , use ${this.issueItem && this.issueItem.type ? this.issueItem.type.toUpperCase() : ''} content to`;
  }

  addIssue() {
    this.issueItem.selected = true;
    this.addIssueEvent.emit(this.issueItem);
  }

  setDefaultAction(): void {
    if (this.portationFormGroup && this.portationFormGroup.get('action') && !this.portationFormGroup.get('action').value) {
      for (const option of this.importDataSelectConfiguration.options) {
        if (option.value === 'LINK_ONLY') {
          this.portationFormGroup.get('action').setValue(option.value);
          break;
        }
      }
    }
  }

  deleteIssue() {
    this.issueItem.selected = false;
    this.deleteIssueEvent.emit(this.itemIndex);
  }

  addActionToItems(selectionValue) {
    this.issueItem['action'] = selectionValue;
  }

  navigateToIssue(type: string) {
    if (this.allowNavigation) {
      if (type === 'AIR') {
        window.open(this.deepLinkURLForAIR + this.issueItem.number, '_blank', '', false);
      } else {
        window.open(this.deepLinkURLForPBS + this.issueItem.ID, '_blank', '', false);
      }
    }
  }

  getProblemID(item) {
    if (item && item.type && item.type.toUpperCase() === 'PBS') {
      return item.projectID;
    } else if (item && item.type && item.type.toUpperCase() === 'AIR') {
      return item.owner.full_name + ' - ' + item.owner.abbreviation;
    } else {
      return '';
    }
  }
  checkForPbs(item) {
    return item.type.toUpperCase() === 'PBS';
  }
  checkForAir(item) {
    return item.type.toUpperCase() === 'AIR';
  }

}
