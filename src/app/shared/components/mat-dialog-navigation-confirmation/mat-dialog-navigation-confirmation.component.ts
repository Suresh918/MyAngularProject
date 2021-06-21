import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'mc-mat-dialog-navigation-confirmation',
  templateUrl: './mat-dialog-navigation-confirmation.component.html',
  styleUrls: ['./mat-dialog-navigation-confirmation.component.scss']
})
export class MatDialogNavigationConfirmationComponent implements OnInit {
  isCaseObject: boolean;
  message: string;
  isFooterButtonsNotRequired: boolean;
  buttonLabel: string;
  headerTitle: string;
  constructor(public dialogRef: MatDialogRef<MatDialogNavigationConfirmationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.isCaseObject = this.data.isCaseObject;
    this.message = this.data.message;
    this.buttonLabel = (this.data.buttonLabel) ? this.data.buttonLabel : 'ok';
    this.headerTitle = (this.data.headerTitle) ? this.data.headerTitle : 'Alert';
    this.isFooterButtonsNotRequired = this.data && this.data.isFooterButtonsNotRequired ?  this.data.isFooterButtonsNotRequired : false;
  }
  onYesClick() {
    this.dialogRef.close(true);
  }
  onNoClick() {
    this.dialogRef.close(false);
  }

}
