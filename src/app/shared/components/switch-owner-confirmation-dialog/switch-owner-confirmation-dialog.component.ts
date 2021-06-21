import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'mc-switch-owner-confirmation-dialog',
  templateUrl: './switch-owner-confirmation-dialog.component.html',
  styleUrls: ['./switch-owner-confirmation-dialog.component.scss']
})
export class SwitchOwnerConfirmationDialogComponent implements OnInit {
  title: string;
  subTitle: string;
  info: string;
  newChangeOwnerType: string;
  oldChangeOwnerType: string;

  constructor(public dialogRef: MatDialogRef<SwitchOwnerConfirmationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.newChangeOwnerType = this.data.currentChangeOwnerType === 'PROJECT' ? 'Creator' : 'Project';
    this.oldChangeOwnerType = this.data.currentChangeOwnerType.charAt(0) + this.data.currentChangeOwnerType.substring(1).toLowerCase();
    this.title = this.data.title;
    this.subTitle = '<b>' + 'Current Change Owner Type: ' + this.oldChangeOwnerType + '</b>';
    const switchOwnerInfo = 'You may change the Owner type to the ' + this.newChangeOwnerType + ', however this will revert the Change Request back to status: Draft. ' +
      'You will not lose any of the already filled data in other tabs.';
    const scopeInfo = 'Contact ' + this.data.changeSpecialist1 + ' as your Change Specialist 1 to revert the Change owner type to ' + this.newChangeOwnerType;
    this.info = this.data.fromScope ? scopeInfo : switchOwnerInfo;
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  onYes(): void {
    this.dialogRef.close(true);
  }

}
