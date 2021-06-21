import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {MetaDataConfiguration, Tag} from '../../../../models/mc-presentation.model';
import {CaseObjectFilterConfiguration} from '../../../../models/mc-filters.model';
import {TagsService} from '../../../../../admin/tags/tags.service';

@Component({
  selector: 'mc-filter-change-details-panel',
  templateUrl: './filter-change-details-panel.component.html',
  styleUrls: ['./filter-change-details-panel.component.scss']
})
export class FilterChangeDetailsPanelComponent implements OnInit {
  @Input()
  caseObject: string;
  @Input()
  caseObjectCurrentFilterFormGroup: FormGroup;
  @Input()
  filterFormConfiguration: { [key: string]: MetaDataConfiguration };
  @Input()
  caseObjectFilterConfiguration: CaseObjectFilterConfiguration;
  @Input()
  historyFormGroup: FormGroup;
  @Input()
  changeDetailsPanelHeader: string;

  constructor(private readonly tagsService: TagsService) {
  }

  ngOnInit() {
    // remove unwanted key value pairs from AIR, PBS objects
    this.caseObjectCurrentFilterFormGroup.valueChanges.subscribe((filterControl) => {
      this.sanitizeAirPbsForHistory(filterControl);
    });
    this.handleLinkedObjectState(this.caseObjectCurrentFilterFormGroup.get('type').value);
    this.getTags();
  }

  getTags(): void {
    this.tagsService.getTags().subscribe((data: Tag[]) => {
      if (data && data.length && this.filterFormConfiguration.tags) {
        this.filterFormConfiguration.tags['options'] = data;
      }
    }, () => {
      this.filterFormConfiguration.tags['options'] = [];
    });
  }

  sanitizeAirPbsForHistory(filterControl) {
    if (filterControl['PCCSTRAIMIDs']) {
      filterControl['PCCSTRAIMIDs'].forEach((item, index) => {
        filterControl['PCCSTRAIMIDs'][index] = {number: item.number};
      });
    }
    if (filterControl['PBSIDs']) {
      filterControl['PBSIDs'].forEach((item, index) => {
        filterControl['PBSIDs'][index] = {ID: item.ID};
      });
    }
  }

  checkForNotificationTypeChanges(): void {
    this.caseObjectCurrentFilterFormGroup.get('type').valueChanges.subscribe(value => {
      const types = value ? value.map(type => type.name) : [];
      if (types.indexOf('ANNOUNCEMENT') > -1 || types.indexOf('REVIEW') > -1) {
        this.caseObjectCurrentFilterFormGroup.get('linkedChangeObject').setValue('');
        this.caseObjectCurrentFilterFormGroup.get('linkedChangeObject').disable();
      } else {
        this.caseObjectCurrentFilterFormGroup.get('linkedChangeObject').enable();
      }
    });
  }

  handleLinkedObjectState(value): void {
    const types = value ? value.map(type => type.name) : [];
    if (types.indexOf('ANNOUNCEMENT') > -1 || types.indexOf('REVIEW') > -1) {
      setTimeout(() => this.caseObjectCurrentFilterFormGroup.get('linkedChangeObject').disable(), 1);
    } else {
      this.caseObjectCurrentFilterFormGroup.get('linkedChangeObject').enable();
    }
    this.checkForNotificationTypeChanges();
  }
}
