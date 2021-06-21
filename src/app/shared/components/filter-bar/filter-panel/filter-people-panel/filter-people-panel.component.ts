import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';

import {FilterBarService} from '../../filter-bar.service';
import {MetaDataConfiguration} from '../../../../models/mc-presentation.model';
import {FormControlConfiguration, FormControlEnumeration} from '../../../../models/mc-configuration.model';
import {CaseObjectFilterConfiguration} from '../../../../models/mc-filters.model';

@Component({
  selector: 'mc-filter-people-panel',
  templateUrl: './filter-people-panel.component.html',
  styleUrls: ['./filter-people-panel.component.scss']
})
export class FilterPeoplePanelComponent implements OnInit, OnChanges {
  @Input()
  caseObject: string;

  @Input()
  set secondaryCaseObjectType(value: string) {
    this.secondaryCaseObjectTypeSelected = value;
  }

  get secondaryCaseObjectType() {
    return this.secondaryCaseObjectTypeSelected;
  }

  @Input()
  formArray: FormArray;
  @Input()
  filterFormConfiguration: { [key: string]: MetaDataConfiguration };
  @Input()
  caseObjectFilterConfiguration: CaseObjectFilterConfiguration;
  @Input()
  historyFormGroup: FormGroup;
  @Input()
  caseObjectCurrentFilterFormGroup: FormGroup;
  @Input()
  layoutType: string;
  userRolesControlGroupConfiguration: FormControlConfiguration;
  defaultSelectedOption: any;
  hideRoles: boolean;
  secondaryCaseObjectTypeSelected: string;

  constructor(private readonly _filterBarService: FilterBarService) {
    this.hideRoles = false;
  }

  ngOnInit() {
    this.userRolesControlGroupConfiguration = this.caseObject === 'review' ?
      {
        'placeholder': 'With Role',
        'label': 'With Role',
        'options': []
      } : {
        'placeholder': 'Is Role',
        'label': 'Is Role',
        'options': []
      };
    this.setPopularRoles();
    this.setRolesForNonCaseObjects();
    this.setDefaultRolesConfiguration();
    this.convertAllUsersToMyTeam();
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (this.formArray && this.formArray.controls && this.formArray.controls.length === 0) {
      this.formArray.push(this._filterBarService.createPeopleFormGroup({}));
    }
    if (simpleChanges.formArray && simpleChanges.formArray.currentValue && simpleChanges.formArray.currentValue.controls && simpleChanges.formArray.currentValue.controls && simpleChanges.formArray.currentValue.controls[0] && simpleChanges.formArray.currentValue.controls[0].value && simpleChanges.formArray.currentValue.controls[0].value && simpleChanges.formArray.currentValue.controls[0].value.role) {
      this.convertAllUsersToMyTeam();
    }
  }

  setPopularRoles(): void {
    if ((this.caseObject === 'changeRequest' || this.caseObject === 'changeNotice' || this.caseObject === 'releasePackage'
      || this.caseObject === 'dashboardWidget' || this.caseObject === 'dashboardActionWidget' || this.caseObject === 'action' || this.caseObject === 'myTeam' || this.caseObject === 'review' || this.caseObject === 'reviewEntry'
      || this.caseObject.toLowerCase().indexOf('notification') > -1 || this.caseObject === 'myTeamManagement') &&
      (this.filterFormConfiguration.role)) {
      if (this.caseObject === 'dashboardWidget') {
        const roles = [];
        this.filterFormConfiguration.role['options'].forEach((role) => {
          if ((role.value !== 'changeSpecialist3' && this.secondaryCaseObjectType === 'ChangeRequest') ||
            (role.value !== 'changeSpecialist1' && this.secondaryCaseObjectType === 'ReleasePackage') ||
            (role.value !== 'changeSpecialist1' && role.value !== 'changeSpecialist3' && this.secondaryCaseObjectType === 'ChangeNotice')) {
            roles.push(role);
          }
        });
        this.setSectionForRoles('Popular Roles', roles);
      } else if (this.caseObject === 'dashboardActionWidget') {
        if (this.filterFormConfiguration.action['role']) {
          this.setSectionForRoles('Popular Roles', this.filterFormConfiguration.action['role']['options']);
        } else {
          this.setSectionForRoles('Popular Roles', []);
        }
      } else {
        this.setSectionForRoles('Popular Roles', this.filterFormConfiguration.role['options']);
      }
      if (this.filterFormConfiguration.otherRoles) {
        this.setSectionForRoles('Team Roles', this.filterFormConfiguration.otherRoles['options']);
      }
    }
  }

  setSectionForRoles(sectionName: string, rolesFormEnumeration: FormControlEnumeration[]) {
    rolesFormEnumeration.forEach(role => {
      this.userRolesControlGroupConfiguration.options.push({
        ...role
      });
    });
  }

  setRolesForNonCaseObjects() {
    if (this.caseObject === 'agenda' || this.caseObject === 'trackerBoard') {
      this.hideRoles = true;
      this.formArray.controls[0].get('role').setValue({
        value: 'createdBy',
        label: 'Creator',
        sequence: 1
      });
    } else if (this.caseObject === 'decisionLog') {
      this.hideRoles = true;
      this.formArray.controls[0].get('role').setValue({
        value: 'attendee',
        label: 'Attendee',
        sequence: 1
      });
    } else if (this.caseObject === 'announcement') {
      this.hideRoles = true;
    } else if (this.caseObject === 'readNotification' || this.caseObject === 'unreadNotification') {
      this.hideRoles = true;
      this.formArray.controls[0].get('role').setValue({
        value: 'userIDs',
        label: 'Creator',
        sequence: 1
      });
    }
  }

  setDefaultRolesConfiguration(): void {
    this.defaultSelectedOption = null;
    if (this.formArray && this.formArray.controls && this.formArray.controls.length === 1) {
      this.formArray.controls.forEach(peopleForm => {
        if (!peopleForm.value.role.value) {
          this.defaultSelectedOption =
            this.userRolesControlGroupConfiguration.options.filter(role => (role.value === 'myTeam')) [0];
        }
      });
    }
  }

  addPeople(): void {
    this.formArray.push(this._filterBarService.createPeopleFormGroup({}));
  }

  removePeople(index: number): void {
    this.formArray.removeAt(index);
  }

  convertAllUsersToMyTeam() {
    if (this.formArray && this.formArray.controls && this.formArray.controls.length === 1) {
      this.formArray.controls.forEach(peopleForm => {
        if (peopleForm.value.role.value === 'allUsers') {
          peopleForm.get('role').setValue(this.userRolesControlGroupConfiguration.options.filter(role => (role.value === 'myTeam'))[0]);
        }
      });
    }
  }
}
