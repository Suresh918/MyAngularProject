import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'mc-mat-dialog-filter-group-delete',
  templateUrl: './mat-dialog-filter-group-delete.component.html',
  styleUrls: ['./mat-dialog-filter-group-delete.component.scss']
})

export class MatDialogFilterGroupDeleteComponent {

  constructor(public dialogRef: MatDialogRef<MatDialogFilterGroupDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  close(decision: boolean) {
    this.dialogRef.close(decision);
  }
}
