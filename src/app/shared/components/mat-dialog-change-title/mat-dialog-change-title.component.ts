import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {select, Store} from '@ngrx/store';
import {Subscription} from 'rxjs';

import {FormControlEnumeration} from '../../models/mc-configuration.model';
import {selectAllCaseActions} from '../../../store';
import {MyChangeState} from '../../models/mc-store.model';
import {CaseAction} from '../../models/case-action.model';
import {CaseActionService} from '../../../core/services/case-action-service';
import {CaseActionStatusMapping, Tag} from '../../models/mc-presentation.model';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {FormGroup} from '@angular/forms';
import {ChangeNotice, ChangeRequest, ReleasePackage} from '../../models/mc.model';
import {TagsService} from '../../../admin/tags/tags.service';

@Component({
  selector: 'mc-mat-dialog-change-title',
  templateUrl: './mat-dialog-change-title.component.html',
  styleUrls: ['./mat-dialog-change-title.component.scss']
})
export class MatDialogChangeTitleComponent implements OnInit, OnDestroy {
  title: string;
  initialTitle: string;
  allowedCaseActions: string[];
  caseActionSubscription: Subscription;
  previousStatuses: any[];
  tagList: any[];
  statusCaseActionMapping: CaseActionStatusMapping[];
  currentStatusLabel: string;
  caseObjectData: ChangeRequest | ChangeNotice | ReleasePackage;
  isInstanceType: boolean;
  constructor(public dialogRef: MatDialogRef<MatDialogChangeTitleComponent>,
              private readonly caseActionService: CaseActionService,
              public readonly helperService: HelpersService,
              public readonly tagsService: TagsService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private readonly appStore: Store<MyChangeState>) {
    this.title = this.data.control && this.data.control.value ? this.data.control.value : '';
    this.tagList = [];
    if (this.data.service.toUpperCase() === 'RELEASEPACKAGE') {
      this.getTagsList();
    }
  }

  ngOnInit() {
    this.initialTitle = this.data.titleControl.value;
    this.caseActionSubscription = this.appStore.pipe(select(selectAllCaseActions)).subscribe((caseActions: CaseAction[]) => {
      const allowedCaseActionObjects = caseActions.filter((caseAction) => caseAction.isAllowed);
      this.allowedCaseActions = allowedCaseActionObjects.map((caseAction) => caseAction.action);
      this.getStatusCaseActionsMapping();
    });
    this.isInstanceType = (this.data.service.toUpperCase() === 'RELEASEPACKAGE') || (this.data.service.toUpperCase() === 'CHANGEREQUEST');
  }

  getTagsList(): void {
    this.tagsService.getTags().subscribe((data: Tag[]) => {
      if (data && data.length) {
        this.tagList = data;
        this.data.tagControlConfiguration.options = data;
      }
    }, () => {
      this.tagList = [];
    });
  }

  getStatusCaseActionsMapping() {
    this.caseActionService.getCaseActionsForStatuses().subscribe(allCaseActions => {
      this.statusCaseActionMapping = allCaseActions[this.data.service];
      this.getPreviousStatusList();
    });
  }

  submit() {
    if (this.data && this.data.control && this.data.control.valid) {
      this.dialogRef.close(true);
    } else {
      this.data.control.markAsTouched();
    }
  }

  close() {
    if (this.data.titleControl.invalid) {
      this.data.titleControl.setValue(this.initialTitle);
    }
    this.dialogRef.close(this.caseObjectData);
  }

  tagsChanged(event) {
    if (event) {
      this.caseObjectData = event;
    }
  }

  getPreviousStatusList(): [string] {
    const caseStatus = this.data.statusControl.value;
    let sequenceNumber = 0;
    this.previousStatuses = [];
    const statusList: FormControlEnumeration[] = this.data.statusControlConfiguration.options
      .map(function (status) {
        if ((status.value === caseStatus) || (status.label === caseStatus)) {
          sequenceNumber = Number(status.sequence);
        }
        status.sequence = Number(status.sequence);
        return status;
      });
    for (const status of statusList) {
      const caseActionForStatus = this.statusCaseActionMapping.find((obj) => (obj.status === status.value || obj.status === status.label.toUpperCase()))
        ? this.statusCaseActionMapping.find((obj) => (obj.status === status.value || obj.status === status.label.toUpperCase())).caseAction : '';
      if ((status.sequence <= sequenceNumber) && !(this.data.service.toUpperCase() === 'RELEASEPACKAGE' && status.value === 'NEW')
        && (this.allowedCaseActions.indexOf(caseActionForStatus) !== -1 || status.sequence === sequenceNumber)) {
        this.previousStatuses.push({value: status.value, label: status.label});
      }
    }
    return this.previousStatuses as [string];
  }

  ngOnDestroy(): void {
    this.caseActionSubscription.unsubscribe();
  }
}
