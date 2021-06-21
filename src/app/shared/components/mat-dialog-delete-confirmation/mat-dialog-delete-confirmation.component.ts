import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'mc-confirm-on-delete-dialog',
  templateUrl: './mat-dialog-delete-confirmation.component.html',
  styleUrls: ['./mat-dialog-delete-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatDialogDeleteConfirmationComponent {

  targetId: number;

  constructor(public dialogRef: MatDialogRef<MatDialogDeleteConfirmationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.targetId = this.data.targetId;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYes(): void {
    this.dialogRef.close(this.targetId);
  }
}
