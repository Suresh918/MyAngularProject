import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'mc-document-delete-dialog-component',
  templateUrl: './document-delete-dialog-component.html',
  styleUrls: ['./document-delete-dialog-component.scss']
})
export class DocumentDeleteDialogComponent {
  constructor(public dialogRef: MatDialogRef<DocumentDeleteDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYes(): void {
    this.dialogRef.close(1);
  }

}
