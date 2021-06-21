import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {select, Store} from '@ngrx/store';
import {Subscription} from 'rxjs';

import {SharedService} from '../../../core/services/shared.service';
import {selectHighSeverityStackState} from '../../store';
import {ErrorResponseModel, ErrorState} from '../../models/mc-store.model';
import {ConfigurationService} from "../../../core/services/configurations/configuration.service";

@Component({
  selector: 'mc-error-dialog',
  templateUrl: './mat-dialog-error.component.html',
  styleUrls: ['./mat-dialog-error.component.scss']
})
export class MatDialogErrorComponent implements OnInit {
  highSeverityErrorStack: Subscription;
  sharepointLink: string;
  disableOverlay: boolean;
  errorItems: ErrorResponseModel[];

  constructor(public dialogRef: MatDialogRef<MatDialogErrorComponent>,
              private readonly sharedService: SharedService,
              private readonly errorStore: Store<ErrorState>,
              public readonly configurationService: ConfigurationService) {
    this.sharepointLink = '';
  }

  close(): void {
    this.dialogRef.close(null);
  }

  ngOnInit() {
    this.highSeverityErrorStack = this.errorStore.pipe(select(selectHighSeverityStackState)).subscribe((res: ErrorResponseModel[]) => {
      if (res) {
        this.errorItems = res;
        res.forEach((item) => {
          if (item.disableOverlay) {
            this.disableOverlay = item.disableOverlay;
            this.dialogRef.disableClose = true;
          }
        });
      }
    });
    if (this.configurationService.getLinkUrl('SharePoint')) {
      this.sharepointLink = this.configurationService.getLinkUrl('SharePoint');
    }
  }
}
