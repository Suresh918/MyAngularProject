import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormArray, FormGroup, Validators} from '@angular/forms';
import {CaseObjectFilterConfiguration} from '../../../../models/mc-filters.model';
import {FormControlConfiguration, FormControlEnumeration} from '../../../../models/mc-configuration.model';
import {FilterBarService} from '../../filter-bar.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'mc-filter-my-team-management-panel',
  templateUrl: './filter-my-team-management-panel.component.html',
  styleUrls: ['./filter-my-team-management-panel.component.scss']
})
export class FilterMyTeamManagementPanelComponent implements OnInit, OnChanges {
  @Input()
  caseObject: string;
  @Input()
  formArray: FormArray;
  @Input()
  filterFormConfiguration: { [key: string]: FormControlConfiguration };
  @Input()
  caseObjectFilterConfiguration: CaseObjectFilterConfiguration;
  @Input()
  historyFormGroup: FormGroup;
  @Input()
  caseObjectCurrentFilterFormGroup: FormGroup;
  userRolesControlGroupConfiguration: FormControlConfiguration;
  initialUserRolesConfiguration: FormControlConfiguration;
  removedUserRolesConfiguration: FormControlConfiguration;
  changeObjectFormConfig: FormControlConfiguration;
  initialChangeObjectFormConfig: FormControlConfiguration;
  defaultSelectedOption: any;
  radioButtonControlConfiguration: FormControlConfiguration;
  mode: string;
  lockMode: string;
  disableControl: boolean;
  radioButtonSubscription$: Subscription;

  constructor(private readonly _filterBarService: FilterBarService) {
    this.radioButtonControlConfiguration = {
      options: [
        {value: 'REPLACE', label: 'Replace a team member'},
        {value: 'REMOVE', label: 'Remove a team member'},
        {value: 'ADD', label: 'Add a team member'}
      ]
    };
  }

  ngOnInit(): void {
    this.mode = this.lockMode = 'EDIT';
    if (this.caseObjectCurrentFilterFormGroup.get('myTeamAction').value === null) {
      this.disableControl = true;
    } else {
      this.disableControl = false;

    }
    this.userRolesControlGroupConfiguration = {
      'placeholder': 'Is Role',
      'label': 'Select User Role',
      'options': []
    };
    this.subscribeToChangeObjectChange();
    this.setPopularRoles();
    this.setDefaultRolesConfiguration();
    this.convertAllUsersToMyTeam();
    this.radioButtonSubscription$ = this.activateObservables();
    this.changeObjectFormConfig = JSON.parse(JSON.stringify(this.filterFormConfiguration['changeObject']));
    this.initialChangeObjectFormConfig = JSON.parse(JSON.stringify(this.filterFormConfiguration['changeObject']));
  }

  ngOnChanges(changes: SimpleChanges) {
   if (this.formArray && this.formArray.controls && this.formArray.controls.length === 0) {
      this.formArray.push(this._filterBarService.createPeopleFormGroup({}));
    }
    if (changes.caseObjectCurrentFilterFormGroup && changes.caseObjectCurrentFilterFormGroup.currentValue) {
      if (changes.caseObjectCurrentFilterFormGroup.currentValue.controls.myTeamAction.value === null) {
        this.caseObjectCurrentFilterFormGroup.get('myTeamAction').setValidators([Validators.required]);
        if (this.radioButtonSubscription$) {
          this.radioButtonSubscription$.unsubscribe();
        }
        this.radioButtonSubscription$ = this.activateObservables();
      } else {
        this.setAdditionalValidations();
      }
    }
  }

  setPopularRoles(): void {
    if (this.filterFormConfiguration.role) {
      this.setSectionForRoles('Popular Roles', this.filterFormConfiguration.role['options']);
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

  setDefaultRolesConfiguration(): void {
    this.defaultSelectedOption = null;
    this.defaultSelectedOption =
      this.userRolesControlGroupConfiguration.options.filter(role => (role.value === 'myTeam')) [0];
  }

  convertAllUsersToMyTeam() {
    if (this.formArray && this.formArray.controls && this.formArray.controls.length === 1) {
      this.formArray.controls.forEach(peopleForm => {
        if (peopleForm.value.role && peopleForm.value.role.value === 'allUsers') {
          peopleForm.get('role').setValue(this.userRolesControlGroupConfiguration.options.filter(role => (role.value === 'myTeam'))[0]);
        }
      });
    }
    this.initialUserRolesConfiguration = JSON.parse(JSON.stringify(this.userRolesControlGroupConfiguration));
    this.removedUserRolesConfiguration = JSON.parse(JSON.stringify(this.userRolesControlGroupConfiguration));
  }

  activateObservables() {
    return this.caseObjectCurrentFilterFormGroup.get('myTeamAction').valueChanges.subscribe(value => {
      this.disableControl = false;
      this.setAdditionalValidations();
    });
  }

  subscribeToChangeObjectChange() {
    const changeObjectValue = this.caseObjectCurrentFilterFormGroup.get('changeObject').value;
    if (changeObjectValue !== '') {
      this.filterFormConfiguration.status = {
        'placeholder': 'Search for Status(s)',
        'label': 'Status',
        'options': this.filterFormConfiguration[changeObjectValue]['status']['options']
      };
    } else {
      this.filterFormConfiguration.status = {
        'placeholder': 'Search for Status(s)',
        'label': 'Status',
        'options': []
      };
    }
    this.caseObjectCurrentFilterFormGroup.get('changeObject').valueChanges.subscribe(value => {
      if (value && this.caseObjectCurrentFilterFormGroup.value.changeObject !== value) {
        this.caseObjectCurrentFilterFormGroup.get('status').setValue([]);
        this.filterFormConfiguration['status']['options'] =
          this.filterFormConfiguration[value]['status']['options'];
      }
    });
  }

  setAdditionalValidations() {
    this.caseObjectCurrentFilterFormGroup.get('changeObject').setValidators([Validators.required]);
    switch (this.caseObjectCurrentFilterFormGroup.get('myTeamAction').value) {
      case 'REPLACE':
        this.formArray.controls[0].get('user').setValidators([Validators.required]);
        this.formArray.controls[0].get('role').setValidators([Validators.required]);
        if (this.removedUserRolesConfiguration) {
          this.removedUserRolesConfiguration.options = (this.initialUserRolesConfiguration && this.initialUserRolesConfiguration.options) ?
            this.initialUserRolesConfiguration.options : [];
        }
        break;
      case 'ADD':
        this.formArray.controls[0].get('user').setValidators([]);
        this.formArray.controls[0].get('role').setValidators([]);
        if (this.removedUserRolesConfiguration) {
          this.removedUserRolesConfiguration.options = (this.initialUserRolesConfiguration && this.initialUserRolesConfiguration.options) ?
            this.initialUserRolesConfiguration.options : [];
        }
        break;
      case 'REMOVE':
        this.formArray.controls[0].get('user').setValidators([Validators.required]);
        this.formArray.controls[0].get('role').setValidators([Validators.required]);
        if (this.removedUserRolesConfiguration) {
          this.removedUserRolesConfiguration.options = (this.initialUserRolesConfiguration && this.initialUserRolesConfiguration.options) ?
            this.initialUserRolesConfiguration.options.filter((roles) => roles.value !== 'changeSpecialist1' && roles.value !== 'changeSpecialist2') : [];
        }
        break;
      default:
    }
    this.formArray.controls[0].get('user').updateValueAndValidity();
  }

  removeIrrelevantChangeObjects(event) {
    this.changeObjectFormConfig = JSON.parse(JSON.stringify(this.initialChangeObjectFormConfig));
    switch (event.value.value) {
      case 'changeSpecialist3':
        this.changeObjectFormConfig.options =
          this.changeObjectFormConfig.options.filter((changeObject) => changeObject.value !== 'changeRequest' && changeObject.value !== 'changeNotice');
        break;
      case 'changeSpecialist1':
        this.changeObjectFormConfig.options =
          this.changeObjectFormConfig.options.filter((changeObject) => changeObject.value !== 'changeNotice' && changeObject.value !== 'releasePackage');
        break;
      case 'changeSpecialist2':
        this.changeObjectFormConfig.options =
          this.changeObjectFormConfig.options.filter((changeObject) => changeObject.value !== 'releasePackage');
        break;
      default:
        break;
    }
  }

  removeIrrelevantRoles(event) {
    const userRolesControlGroupConfiguration = JSON.parse(JSON.stringify(this.initialUserRolesConfiguration));
    switch (event.value) {
      case 'changeRequest':
        this.removedUserRolesConfiguration.options = userRolesControlGroupConfiguration.options.filter(
          (roles) => roles.value !== 'changeSpecialist3');
        break;
      case 'changeNotice':
        this.removedUserRolesConfiguration.options = userRolesControlGroupConfiguration.options.filter(
          (roles) => roles.value !== 'changeSpecialist1' && roles.value !== 'changeSpecialist3');
        break;
      case 'releasePackage':
        this.removedUserRolesConfiguration.options = userRolesControlGroupConfiguration.options.filter(
          (roles) => roles.value !== 'changeSpecialist1' && roles.value !== 'changeSpecialist2');
        break;
      default:
        break;
    }
  }
}
