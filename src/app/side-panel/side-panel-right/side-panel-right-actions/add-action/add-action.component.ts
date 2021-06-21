import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Store} from '@ngrx/store';

import {User} from '../../../../shared/models/mc.model';
import {ActionFormConfiguration} from '../../../../shared/models/mc-configuration.model';
import {DateTimeFormatter} from '../../../../core/utilities/date-time-formatter.service';
import {ActionService} from '../../../../core/services/action.service';
import {FormActionType} from '../../../../shared/models/mc-presentation.model';
import { MatDialogNavigationConfirmationComponent } from '../../../../shared/components/mat-dialog-navigation-confirmation/mat-dialog-navigation-confirmation.component';
import {SidePanelState} from '../../../../shared/models/mc-store.model';
import {setRightPanelFormDirty} from '../../../store';
import {ActionHistoryModel} from '../../../../shared/models/mc-history-model';
import {UserProfileService} from '../../../../core/services/user-profile.service';
import {HistoryService} from '../../../../core/services/history.service';
import {HelpersService} from '../../../../core/utilities/helpers.service';


@Component({
  selector: 'mc-add-action',
  templateUrl: './add-action.component.html',
  styleUrls: ['./add-action.component.scss']
})
export class AddActionComponent implements OnInit {
  @Input()
  actionFormGroup: FormGroup;
  @Input()
  actionFormConfiguration: ActionFormConfiguration;
  @Input()
  formActionType: FormActionType;
  @Input()
  linkedItem: any;
  @Output()
  readonly refreshActions: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  readonly cancel: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  readonly updateInProgress: EventEmitter<boolean> = new EventEmitter<boolean>();
  today: Date;
  isFormStatusDispatched: boolean;
  actionHistoryFormGroup: FormGroup;

  constructor(private readonly formBuilder: FormBuilder,
              private readonly dateTimeFormatter: DateTimeFormatter,
              private readonly actionService: ActionService,
              public dialog: MatDialog,
              private readonly sidePanelStore: Store<SidePanelState>,
              private readonly userProfileService: UserProfileService,
              private readonly helpersService: HelpersService,
              private readonly historyService: HistoryService) {
    this.isFormStatusDispatched = false;
  }

  ngOnInit() {
    if (this.actionFormGroup.get('type').value && this.actionFormGroup.get('type').value === 'REVIEW') {
      this.actionFormGroup.get('type').disable();
    }
    this.actionFormConfiguration.deadline['minDate'] = new Date();
    this.today = new Date();
    this.dispatchFormStatusChanges();
    this.loadHistory();
    this.registerTypeChangesSubscription();
  }

  loadHistory(): void {
    const userProfileState = this.userProfileService.getStatesData();
    const actionFormHistory = userProfileState.caseObjectHistory.actionHistory;
    this.actionHistoryFormGroup = this.historyService.createActionHistoryFormGroup(new ActionHistoryModel(actionFormHistory));
    this.actionHistoryFormGroup.valueChanges.subscribe((actionHistory) => {
      userProfileState.caseObjectHistory.actionHistory = actionHistory;
      this.userProfileService.updateUserProfileStates(userProfileState);
    });
  }

  updateAction(caseAction: string): void {
    if (this.formActionType === 'edit') {
      const actionData = this.actionFormGroup.getRawValue();
      actionData.deadline = this.dateTimeFormatter.setDateTime(actionData.deadline);
      actionData.assignee = new User(actionData.assignee);
      actionData.generalInformation.title = actionData.title ? actionData.title : '';
      delete actionData.status;
      delete actionData.title;
      this.updateInProgress.emit(true);
      this.actionService.updateAction(actionData, caseAction).subscribe(res => {
        this.updateInProgress.emit(false);
        this.RefreshActions(res.ID);
      }, err => {
        this.updateInProgress.emit(false);
      });
    } else {
      caseAction = caseAction === 'SAVE' ? 'DEFINE' : caseAction;
      this.initializeNewAction(caseAction);
    }
  }

  initializeNewAction(actionMethod: string) {
    const actionData = this.actionFormGroup.getRawValue();
    actionData.deadline = this.dateTimeFormatter.setDateTime(actionData.deadline);
    actionData.assignee = new User(actionData.assignee);
    this.updateInProgress.emit(true);
    this.actionService.createAction(this.linkedItem, actionData, actionMethod, actionData.type).subscribe(res => {
      this.updateInProgress.emit(false);
      this.RefreshActions(res.ID);
    }, err => {
      this.updateInProgress.emit(false);
    });
  }

  RefreshActions(actionId: string): void {
    this.refreshActions.emit(actionId);
    this.sidePanelStore.dispatch(setRightPanelFormDirty(false));
  }

  cancelActionUpdate(): void {
    if (this.actionFormGroup.dirty) {
      let dialogRef: MatDialogRef<MatDialogNavigationConfirmationComponent>;
      dialogRef = this.dialog.open(MatDialogNavigationConfirmationComponent, {
        width: '50rem',
        data: {
          isCaseObject: false
        }
      });
      dialogRef.afterClosed().subscribe(confirm => {
        if (confirm) {
          this.sidePanelStore.dispatch(setRightPanelFormDirty(false));
          this.cancel.emit(true);
        }
      });
    } else {
      this.cancel.emit(true);
    }
  }

  dispatchFormStatusChanges(): void {
    this.actionFormGroup.statusChanges.subscribe(res => {
      this.sidePanelStore.dispatch(setRightPanelFormDirty(this.actionFormGroup.dirty));
      this.isFormStatusDispatched = true;
    });
  }

  registerTypeChangesSubscription() {
    this.actionFormGroup.get('type').valueChanges.subscribe((value: string) => {
      if ((this.actionFormGroup.get('type').dirty || this.actionFormGroup.get('type').value) && this.isTitlePristine()) {
        this.actionFormGroup.get('generalInformation.title').setValue(this.helpersService.getActionTitleFromType(value));
      }
    });
  }

  isTitlePristine(): boolean {
    const actionTitle = this.actionFormGroup.get('generalInformation.title').value;
    if (!actionTitle) {
      return true;
    } else {
      const titles: string[] = [];
      this.helpersService.getActionTypeAndTitleMapping().forEach(item => titles.push(item.title));
      return titles.indexOf(actionTitle) > -1;
    }
  }
}
