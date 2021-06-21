import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'mc-mat-dialog-notification',
  templateUrl: './mat-dialog-notification.component.html',
  styleUrls: ['./mat-dialog-notification.component.scss']
})
export class MatDialogNotificationComponent {

  constructor(public dialogRef: MatDialogRef<MatDialogNotificationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  dismissAnnouncement(): void {
    this.dialogRef.close(this.data.announcement.ID);
  }

  openURL(): void {
    if (this.data.announcement.link) {
      window.open(this.data.announcement.link, '_blank');
    }
  }
}
