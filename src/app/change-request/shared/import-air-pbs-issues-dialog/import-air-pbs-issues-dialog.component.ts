import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatStepper} from '@angular/material/stepper';
import { FormArray } from '@angular/forms';
import { ChangeRequestService } from '../../change-request.service';
import { McFormGroupPresentationService } from '../../../core/utilities/mc-form-group-presentation.service';
import {MatDialogNavigationConfirmationComponent} from '../../../shared/components/mat-dialog-navigation-confirmation/mat-dialog-navigation-confirmation.component';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {Location} from '@angular/common';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';

@Component({
  selector: 'mc-import-air-pbs-issues-dialog',
  templateUrl: './import-air-pbs-issues-dialog.component.html',
  styleUrls: ['./import-air-pbs-issues-dialog.component.scss'],
  providers: [{provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}}]
})
export class ImportAirPbsIssuesDialogComponent implements OnInit{
  @ViewChild('stepper') stepper: MatStepper;
  selectedStepIndex: number;
  selectedItemsToImport: any[];
  importContentFormConfiguration: any;
  airActionFormConfiguration: any;
  linkedPbsIds: string[];
  linkedAirIds: string[];
  portationFormGroupArray: FormArray;
  errorData: any;
  enableStepper: boolean;
  trigger: string;
  errorSummary: string;
  showCloseButton: boolean;
  importLoading: boolean;
  linkError: boolean;
  importError: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public readonly dialog: MatDialog,
              public readonly location: Location,
              public readonly dialogRef: MatDialogRef<ImportAirPbsIssuesDialogComponent>,
              private readonly configurationService: ConfigurationService,
              private readonly changeRequestService: ChangeRequestService,
              private readonly mCFormGroupPresentationService: McFormGroupPresentationService) {
    this.selectedStepIndex = 0;
    this.linkedAirIds = data.linkedAirIds;
    this.linkedPbsIds = data.linkedPbsIds;
    this.errorData = null;
    this.enableStepper = false;
    this.trigger = data.trigger;
    this.showCloseButton = false;
    this.importLoading = false;
  }

  ngOnInit() {
    this.selectedItemsToImport = [];
    this.importContentFormConfiguration = this.configurationService.getFormFieldParameters('MCCommon')['portation'];
    this.airActionFormConfiguration = this.configurationService.getFormFieldParameters('ChangeRequest2.0')['portation'];
  }

  importIssues(): void {
    this.importLoading = true;
    this.dialogRef.disableClose = true;
    const linkedItems = this.selectedItemsToImport.filter(obj => obj.selected).map(obj => obj.number || obj.ID);
    const constructedList = this.constructLinkeditemList(this.selectedItemsToImport);
    if (this.trigger && this.trigger.toLowerCase().includes('air')) {
      this.changeRequestService.linkAIRIssues(constructedList, this.data.changeRequestID).subscribe((res) => {
        if (res && res.length > 0) {
          res.forEach(item => {
            if (item && item.link_status && item.import_status) {
              this.importLoading = false;
              this.dialogRef.close(linkedItems);
            } else {
              this.importLoading = false;
              this.linkError = item.link_status !== 'SUCCESS';
              this.importError = item.import_status !== 'SUCCESS';
            }
          });
        } else {
          this.importLoading = false;
          this.linkError = true;
          this.importError = true;
          this.selectionListChanged();
          this.showCloseButton = true;
        }
      });
    } else if (this.trigger && this.trigger.toLowerCase().includes('pbs')) {
      this.changeRequestService.linkPBSIssues(constructedList, this.data.changeRequestID).subscribe((res) => {
        if (res && res.length > 0) {
          res.forEach(item => {
            if (item && item.link_status && item.import_status) {
              this.importLoading = false;
              this.dialogRef.close(linkedItems);
            } else {
              this.importLoading = false;
              this.linkError = item.link_status !== 'SUCCESS';
              this.importError = item.import_status !== 'SUCCESS';
            }
          });
        } else {
          this.importLoading = false;
          this.linkError = true;
          this.importError = true;
          this.selectionListChanged();
          this.showCloseButton = true;
        }
      });
    }
  }

  cancel(checkForConfirmation: boolean): void {
    if (this.selectedItemsToImport.length > 0 && checkForConfirmation && !this.showCloseButton) {
      let dialogRef: MatDialogRef<MatDialogNavigationConfirmationComponent>;
      dialogRef = this.dialog.open(MatDialogNavigationConfirmationComponent, {
        width: '50rem',
        data: {
          isCaseObject: false
        }
      });
      dialogRef.afterClosed().subscribe(confirm => {
        if (confirm) {
          this.location.go('change-requests/' + this.data.changeRequestID);
          this.dialogRef.close();
        }
      });
    } else {
      this.location.go('change-requests/' + this.data.changeRequestID);
      this.dialogRef.close({linkError: this.linkError, importError: this.importError});
    }
  }

  onClickNext() {
    if (this.selectedItemsToImport.length === 1) {
      this.stepper.selectedIndex = 2;
    } else {
      this.stepper.next();
    }
  }

  onClickPrevious() {
    this.stepper.previous();
  }

  onStepSelection(event) {
    if (!this.enableStepper) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.selectedStepIndex = event.selectedIndex;
  }

  constructLinkeditemList(selectedItemsList) {
    const linkedItemslist = [];
    selectedItemsList.forEach((selectedItem, index) => {
      const listItem = {
        'id': selectedItem.id || selectedItem.number,
        'type': selectedItem.itemType,
        'action': this.portationFormGroupArray.value[index].action || ''
      };
      linkedItemslist.push(listItem);
    });
    return linkedItemslist;
  }

  onConfirmInfo() {
    this.enableStepper = true;
  }
  selectionListChanged() {
    this.portationFormGroupArray = this.mCFormGroupPresentationService.createPortationFormGroupArray(this.selectedItemsToImport);
  }
}
