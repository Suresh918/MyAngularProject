import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatStepper} from '@angular/material/stepper';
import {
  ChangeRequestFormConfiguration,
  DefineScopeFormConfiguration
} from '../../../../../shared/models/mc-configuration.model';
import {ChangeRequestService} from '../../../../change-request.service';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {McStatesModel} from '../../../../../shared/models/mc-states-model';
import {UserProfileService} from '../../../../../core/services/user-profile.service';
import {ConfigurationService} from '../../../../../core/services/configurations/configuration.service';
import {SwitchOwnerConfirmationDialogComponent} from '../../../../../shared/components/switch-owner-confirmation-dialog/switch-owner-confirmation-dialog.component';
import {ChangeRequest, MiraiUser} from '../../../../../shared/models/mc.model';

@Component({
  selector: 'mc-creator-change-request-define-scope-dialog',
  templateUrl: './creator-change-request-define-scope-dialog.component.html',
  styleUrls: ['./creator-change-request-define-scope-dialog.component.scss'],
  providers: [{provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}}]
})
export class CreatorChangeRequestDefineScopeDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('stepper') stepper: MatStepper;
  defineScopeConfiguration: DefineScopeFormConfiguration;
  changeRequestConfiguration: ChangeRequestFormConfiguration;
  changeRequestFormGroup: FormGroup;
  savedFormGroupData: ChangeRequest;
  mcState: McStatesModel;
  selectedStepIndex: number;
  enableStepper: boolean;
  disableNext = true;
  currentValidStepIndex = 0;
  validSteps = [0, 4];
  progressBar = false;
  checked: boolean;
  showInfoDialog: boolean;

  steps: Array<HTMLElement> = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public readonly dialog: MatDialog,
              private readonly dialogRef: MatDialogRef<CreatorChangeRequestDefineScopeDialogComponent>,
              private readonly userProfileService: UserProfileService,
              private readonly configurationService: ConfigurationService,
              private readonly changeRequestService: ChangeRequestService) {
    this.selectedStepIndex = 0;
    this.enableStepper = false;
    this.changeRequestConfiguration = data.changeRequestConfiguration;
    this.savedFormGroupData = JSON.parse(JSON.stringify(data.changeRequestFormGroup.value));
    this.changeRequestFormGroup = data.changeRequestFormGroup;
    if (this.changeRequestFormGroup.get('issue_types') && this.changeRequestFormGroup.get('issue_types').value.includes('PROCEDURE')) {
      this.changeRequestFormGroup.get('scope.parts').setValue('OUT-SCOPE');
      this.changeRequestFormGroup.get('scope.tooling').setValue('OUT-SCOPE');
      this.changeRequestFormGroup.get('scope.packaging').setValue('OUT-SCOPE');
      this.changeRequestFormGroup.get('scope.bop').setValue('IN-SCOPE');
    }
    this.defineScopeConfiguration = this.configurationService.getFormFieldParameters('MCCommon') as DefineScopeFormConfiguration;

  }
  ngOnInit(): void {
    this.mcState = this.userProfileService.getStatesData();
    this.showInfoDialog = this.mcState.changeRequestState.detailsPageState.showInfoDialog;
    this.showInfoDialog = (this.showInfoDialog !== undefined) ? this.showInfoDialog : true;
    this.enableStepper = (this.showInfoDialog !== undefined) ? !this.showInfoDialog : true;
  }

  ngAfterViewInit() {
    this.syncHTMLSteps();
    this.validateNextButton();
    this.changeRequestFormGroup.get('scope.parts').setValidators([Validators.required]);
    this.changeRequestFormGroup.get('scope.tooling').setValidators([Validators.required]);
    this.changeRequestFormGroup.get('scope.packaging').setValidators([Validators.required]);
    this.setValidations('scope.parts', this.changeRequestFormGroup.get('scope.part_detail'), 1);
    this.setValidations('scope.tooling', this.changeRequestFormGroup.get('scope.tooling_detail'), 2);
    this.setValidations('scope.packaging', this.changeRequestFormGroup.get('scope.packaging_detail'), 3);
    this.validSteps.sort((a, b) => a - b);
  }

  onClickNext() {
    if (this.changeRequestFormGroup.get('scope.parts').value === 'IN-SCOPE' || this.changeRequestFormGroup.get('scope.tooling').value === 'IN-SCOPE'
      || this.changeRequestFormGroup.get('scope.packaging').value === 'IN-SCOPE') {
      const scopeName = this.changeRequestFormGroup.get('scope.parts').value === 'IN-SCOPE' ? 'Parts' :
                      (this.changeRequestFormGroup.get('scope.tooling').value === 'IN-SCOPE' ? 'Tooling' : 'Packaging');
      this.dialogRef.close();
      this.openWarningDialog('CREATOR', scopeName);
    } else {
      this.currentValidStepIndex === this.validSteps.length - 1 ? this.currentValidStepIndex = this.validSteps.length - 1 : ++this.currentValidStepIndex;
      this.changeStepperSelectedIndex();
      this.validateNextButton();
    }
  }

  openWarningDialog(currentChangeOwnerType, scopeName) {
    this.changeRequestFormGroup.patchValue(this.savedFormGroupData);
    let dialogRef: MatDialogRef<SwitchOwnerConfirmationDialogComponent>;
    dialogRef = this.dialog.open(SwitchOwnerConfirmationDialogComponent, {
      width: '65rem',
      data: {
        currentChangeOwnerType: currentChangeOwnerType,
        dialogTitle: 'Define Scope',
        title: 'Warning, Your Scope contains ' + scopeName,
        changeSpecialist1: this.changeRequestFormGroup.get('change_specialist1').value.full_name,
        cs1Control: new FormControl(new MiraiUser(this.changeRequestFormGroup.get('change_specialist1').value)),
        cs1Configuration: this.changeRequestConfiguration.change_specialist1,
        fromScope: true
      }
    });
  }

  changeStepperSelectedIndex() {
    this.stepper.selectedIndex = this.validSteps[this.currentValidStepIndex];
  }

  onClickPrevious() {
    this.currentValidStepIndex === 0 ? this.currentValidStepIndex = 0 : --this.currentValidStepIndex;
    this.changeStepperSelectedIndex();
    this.validateNextButton();
  }

  onStepSelection(event) {
    if (!this.enableStepper) {
      event.stopPropagation();
      return;
    }
    this.selectedStepIndex = event.selectedIndex;
    this.checkValidityOnSelectedIndex(this.selectedStepIndex);
  }

  onConfirmInfo() {
    this.enableStepper = true;
  }

  cancel(checkForConfirmation: boolean): void {
    this.changeRequestFormGroup.patchValue(this.savedFormGroupData);
    this.dialogRef.close();
  }

  saveDefineScope(): void {
    if (this.changeRequestFormGroup.get('scope.parts').valid &&
      this.changeRequestFormGroup.get('scope.tooling').valid &&
      this.changeRequestFormGroup.get('scope.packaging').valid &&
      this.changeRequestFormGroup.get('scope.bop').valid) {
      const payload = this.getPayload();
      this.progressBar = true;
      this.changeRequestService.saveDefineScope(this.changeRequestFormGroup.get('scope.id').value, payload).subscribe((res) => {
        this.progressBar = false;
        if (res) {
          this.dialogRef.close(res);
        }
      },
        () => {
          this.progressBar = false;
        });
    }
  }

  getPayload() {
    const payload = {};
    payload['part_detail'] = this.changeRequestFormGroup.get('scope.part_detail').value;
    payload['parts'] = this.changeRequestFormGroup.get('scope.parts').value;
    payload['tooling_detail'] = this.changeRequestFormGroup.get('scope.tooling_detail').value;
    payload['tooling'] = this.changeRequestFormGroup.get('scope.tooling').value;
    payload['packaging_detail'] = this.changeRequestFormGroup.get('scope.packaging_detail').value;
    payload['packaging'] = this.changeRequestFormGroup.get('scope.packaging').value;
    payload['scope_details'] = this.changeRequestFormGroup.get('scope.scope_details').value;
    payload['bop'] = this.changeRequestFormGroup.get('scope.bop').value;
    return payload;
  }

  setValidations(parent: string, child, index: number) {
    if (this.changeRequestFormGroup.get(parent).value === 'IN-SCOPE') {
      Object.keys(child.controls).forEach(key => {
        child.get(key).setValidators(Validators.required);
        child.get(key).updateValueAndValidity();
        this.changeRequestFormGroup.get(parent).updateValueAndValidity();
      });
    } else {
      Object.keys(child.controls).forEach(key => {
        child.get(key).setValidators();
      });
    }
    this.updateValidSteps(parent, this.changeRequestFormGroup.get(parent).value === 'IN-SCOPE', index);
    this.validSteps = this.uniq(this.validSteps);
    this.validSteps.sort((a, b) => a - b);
    this.validateNextButton();
  }

  validateNextButton(parent?: string, child?) {
    if (parent && child && this.changeRequestFormGroup.get(parent).value === 'IN-SCOPE') {
      if (this.inScopeCount(child) > 0) {
        this.checkValidityOnSelectedIndex();
      } else {
        this.disableNext = true;
      }
    } else {
      this.checkValidityOnSelectedIndex();
    }
  }

  inScopeCount(childControlObj) {
    const childControls = [];
    Object.keys(childControlObj.controls).forEach((childControlKey) => childControls.push(childControlObj.get(childControlKey)));
    return childControls.filter(childControl => childControl.value === 'IN-SCOPE').length;
  }

  checkValidityOnSelectedIndex(selectedIndex?) {
    this.disableNext = true;
    switch (selectedIndex !== undefined ? selectedIndex : this.stepper.selectedIndex) {
      case 0:
      case 4:
        if (
          this.changeRequestFormGroup.get('scope.parts').valid &&
          this.changeRequestFormGroup.get('scope.tooling').valid &&
          this.changeRequestFormGroup.get('scope.packaging').valid
        ) {
          this.disableNext = false;
        }
        break;
      case 1:
        if (this.changeRequestFormGroup.get('scope.part_detail').valid && this.inScopeCount(this.changeRequestFormGroup.get('scope.part_detail')) > 0) {
          this.disableNext = false;
        }
        break;
      case 2:
        if (this.changeRequestFormGroup.get('scope.tooling_detail').valid && this.inScopeCount(this.changeRequestFormGroup.get('scope.tooling_detail')) > 0) {
          this.disableNext = false;
        }
        break;
      case 3:
        if (this.changeRequestFormGroup.get('scope.packaging_detail').valid && this.inScopeCount(this.changeRequestFormGroup.get('scope.packaging_detail')) > 0) {
          this.disableNext = false;
        }
        break;
    }
  }

  updateValidSteps(control: string, isInScope: boolean, index: number) {
    if (isInScope) {
      this.updateStepState(index, true);
      this.validSteps.push(index);
    } else {
      this.updateStepState(index, false);
      if (this.validSteps.indexOf(index) !== -1) {
        this.validSteps.splice(this.validSteps.indexOf(index), 1);
      }
    }
  }

  uniq(a) {
    return a.sort().filter(function (item, pos, ary) {
      return !pos || item !== ary[pos - 1];
    });
  }

  dontShowInfoAgain(event) {
    this.checked = event.checked;
    this.mcState = this.userProfileService.getStatesData();
    this.mcState.changeRequestState.detailsPageState.showInfoDialog = !event.checked;
    this.userProfileService.updateUserProfileStates(this.mcState);
  }

  // this is to get all the steps from stepper
  private syncHTMLSteps() {
    this.steps = [];
    const increment = 2; // 2, because Angular adds 2 elements for each horizontal step
    const stepper: HTMLElement = document.querySelector('.mat-horizontal-stepper-header-container');
    for (let i = 0; i < stepper.children.length; i += increment) {
      this.steps.push(stepper.children[i] as HTMLElement);
    }
  }

  // Enables or disables stepper based on boolean passed
  private updateStepState(step: number, enabled: boolean) {
    // reset classes before setting it
    this.steps[step].classList.remove('step-enabled');
    this.steps[step].classList.remove('step-disabled');
    if (this.steps && this.steps[step]) {
      // If you prefer to start using step 0, remove -1 here
      this.steps[step].classList.add(enabled ? 'step-enabled' : 'step-disabled');
    }
  }
}
