import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MetaDataConfiguration} from '../../../../models/mc-presentation.model';
import {CaseObjectFilterConfiguration, MCDatePickerRangeValue} from 'app/shared/models/mc-filters.model';

@Component({
  selector: 'mc-filter-urgency-panel',
  templateUrl: './filter-urgency-panel.component.html',
  styleUrls: ['./filter-urgency-panel.component.scss']
})
export class FilterUrgencyPanelComponent implements OnInit, OnChanges {
  @Input()
  caseObject: string;
  @Input()
  caseObjectCurrentFilterFormGroup: FormGroup;
  @Input()
  filterFormConfiguration: { [key: string]: MetaDataConfiguration };
  @Input()
  caseObjectFilterConfiguration: CaseObjectFilterConfiguration;
  valueSelected: string[];
  actionDatesFormControl = new FormControl();
  actionDatesList: string[] = ['Late', 'Soon', 'Open', 'Accepted'];
  dueDate: MCDatePickerRangeValue;
  selectedDatesArray: MCDatePickerRangeValue[];

  constructor() {
  }

  ngOnInit() {
    // added for contained actions filter issue, Need to be removed later
    if (this.caseObjectCurrentFilterFormGroup) {
      this.actionDatesFormControl.setValue(this.caseObjectCurrentFilterFormGroup.get('actionDisplayStatus').value);
    }
    this.actionDatesFormControl.valueChanges.subscribe(actionDate => {
      if (actionDate) {
        this.valueSelected = this.actionDatesFormControl.value;
        this.setDueDateFiltersForActions(this.valueSelected);
      }
    });
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges && simpleChanges.caseObjectCurrentFilterFormGroup && simpleChanges.caseObjectCurrentFilterFormGroup.currentValue) {
      this.actionDatesFormControl.setValue(this.caseObjectCurrentFilterFormGroup.get('actionDisplayStatus').value);
    }
  }

  setDueDateFiltersForActions(actionDateList: string[]): MCDatePickerRangeValue[] {
    this.selectedDatesArray = [];
    const actionStatus = [];
    // Present date
    const currentDate = new Date();
    // Project starting date
    const initialDate = new Date(2017, 6, 1);
    // late date ie., current - 1 (to avoid overlap actions)
    const lateDate = new Date();
    lateDate.setDate(currentDate.getDate() - 1);
    // Coming date ie., current + a week
    const soonDate = new Date();
    soonDate.setDate(currentDate.getDate() + 7);
    if (actionDateList.length > 0) {
      actionDateList.forEach((actionDate) => {
        if (actionDate['value'] === 'Late') {
          this.dueDate = {
            begin: initialDate,
            end: lateDate
          };
          // name is to identify which date it is while filtering
          this.dueDate['value'] = 'Late';
          this.selectedDatesArray.push(this.dueDate);
        } else if (actionDate['value'] === 'Soon') {
          this.dueDate = {
            begin: currentDate,
            end: soonDate
          };
          // name is to identify which date it is while filtering
          this.dueDate['value'] = 'Soon';
          this.selectedDatesArray.push(this.dueDate);
        } else if (actionDate['value'] === 'Open') {
          actionStatus.push({label: 'Open', name: 'OPEN', sequence: 2});
        } else {
          actionStatus.push({label: 'Accepted', name: 'ACCEPTED', sequence: 3});
        }
        this.caseObjectCurrentFilterFormGroup.get('actionStatus').setValue(actionStatus);
        this.caseObjectCurrentFilterFormGroup.get('actionDates').setValue(this.selectedDatesArray);
      });
    } else {
      this.caseObjectCurrentFilterFormGroup.get('actionStatus').setValue(actionStatus);
      this.caseObjectCurrentFilterFormGroup.get('actionDates').setValue(this.selectedDatesArray);
    }
    // added for contained actions filter issue, Need to be removed later
    this.caseObjectCurrentFilterFormGroup.get('actionDisplayStatus').setValue(actionDateList);
    return this.selectedDatesArray;
  }

}
