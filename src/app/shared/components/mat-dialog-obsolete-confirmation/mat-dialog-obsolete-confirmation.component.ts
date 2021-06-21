import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MatDialogNavigationConfirmationComponent} from '../mat-dialog-navigation-confirmation/mat-dialog-navigation-confirmation.component';

@Component({
  selector: 'mc-mat-dialog-obsolete-confirmation',
  templateUrl: './mat-dialog-obsolete-confirmation.component.html',
  styleUrls: ['./mat-dialog-obsolete-confirmation.component.scss']
})
export class MatDialogObsoleteConfirmationComponent {

  constructor(public dialogRef: MatDialogRef<MatDialogNavigationConfirmationComponent>) {
  }

  onYesClick() {
    this.dialogRef.close(true);
  }

  onNoClick() {
    this.dialogRef.close(false);
  }

}
