import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'mc-mat-dialog-change-action-title',
  templateUrl: './mat-dialog-change-action-title.component.html',
  styleUrls: ['./mat-dialog-change-action-title.component.scss']
})
export class MatDialogChangeActionTitleComponent implements OnInit {

  title: string;

  constructor(public dialogRef: MatDialogRef<MatDialogChangeActionTitleComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = this.data.control && this.data.control.value ? this.data.control.value : '';
  }

  ngOnInit() {
  }

  submit() {
    if (this.data && this.data.control && this.data.control.valid) {
      this.dialogRef.close(true);
    } else {
      this.data.control.markAsTouched();
    }
  }

  close(changed: boolean) {
    this.data.control.setValue(this.title);
    this.dialogRef.close(changed);
  }

}
