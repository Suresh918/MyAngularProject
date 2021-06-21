import {Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {debounceTime} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';

import {ActionService} from '../../../core/services/action.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {MCFormGroupService} from '../../../core/utilities/mc-form-group.service';
import {FileService} from '../../../core/services/file.service';
import {
  ActionFormConfiguration,
  FormControlConfiguration,
  FormControlEnumeration
} from '../../../shared/models/mc-configuration.model';
import {ActionRejectDialogComponent} from '../../../action/shared/action-reject-dialog/action-reject-dialog.component';
import {ActionDeleteDialogComponent} from '../../../action/shared/action-delete-dialog/action-delete-dialog.component';
import {environment} from '../../../../environments/environment';
import {
  Action,
  ActionSummary,
  Agenda,
  AgendaItem,
  CaseObject,
  ChangeNotice,
  ChangeRequest,
  Document,
  ReleasePackage,
  User
} from '../../../shared/models/mc.model';
import {AggregatedAction, UpdateActionData} from '../../../shared/models/mc-presentation.model';
import {SharedService} from '../../../core/services/shared.service';
import {MyChangeState} from '../../../shared/models/mc-store.model';
import {DateTimeFormatter} from '../../../core/utilities/date-time-formatter.service';
import {refreshLinkedItemsCount} from '../../../store';
import {ActionDetailsService} from '../../../action/action-details/action-details.service';
import {FilterService} from '../../../core/utilities/filter.service';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';

type CaseObjectUnion = ChangeRequest | ChangeNotice | ReleasePackage | Agenda | AgendaItem;
@Component({
  selector: 'mc-side-panel-right-actions',
  templateUrl: './side-panel-right-actions.component.html',
  styleUrls: ['./side-panel-right-actions.component.scss'],
  providers: [ActionDetailsService]
})
export class SidePanelRightActionsComponent implements OnInit, OnDestroy {
  @Input()
  panelMode: string;
  objectType: string;
  aggregatedAction: AggregatedAction;
  caseObject: CaseObjectUnion;
  addCommentControlConfiguration: FormControlConfiguration;
  actionFormConfiguration: ActionFormConfiguration;
  actionFormGroup: FormGroup;
  noteFormGroup: FormGroup;
  currentUser: User;
  actionsMenuSelected: number;
  actionCategoryList: any[];
  linkedItem: any;
  today: Date;
  progressBar: boolean;
  docUrl: string;
  newNoteAttachments: Document[];
  caseObjectSubscription$: Subscription;
  toggleActionViewControl: FormControl;
  openAcceptedCount: number;
  allActionsCount: number;
  showActionForm: boolean;
  formActionType: string;
  scrollItemId: string;
  filterQuery: string;
  action: Action;
  actionObject: Action;
  caseObjectAbbreviation: string;
  updateInProgress: boolean;
  typeInProgress: boolean;

  constructor(private readonly actionDialog: MatDialog,
              private readonly actionService: ActionService,
              private readonly configurationService: ConfigurationService,
              private readonly formBuilder: FormBuilder,
              private readonly customAlert: MatSnackBar,
              private readonly helpersService: HelpersService,
              private readonly mcFormGroupService: MCFormGroupService,
              private readonly router: Router,
              private readonly sharedService: SharedService,
              private readonly fileService: FileService,
              private readonly actionDetailService: ActionDetailsService,
              private readonly filterService: FilterService,
              private readonly dateTimeFormatter: DateTimeFormatter,
              private readonly appStore: Store<MyChangeState>,
              private readonly elementRef: ElementRef) {
    this.currentUser = new User(this.configurationService.getUserProfile());
    this.progressBar = false;
    this.actionsMenuSelected = 0;
    this.showActionForm = false;
    this.updateInProgress = false;
    this.openAcceptedCount = 0;
    this.allActionsCount = 0;
    this.actionCategoryList = [];
    this.constructNotesFormGroup();
    this.today = new Date();
    this.today.setHours(0, 0, 0);
    this.addCommentControlConfiguration = {
      placeholder: 'Add comment',
      help: 'Add comment',
      hint: '',
      label: '',
      tag: ''
    } as FormControlConfiguration;
    this.docUrl = `${environment.rootURL}mc${environment.version}/documents`;
    this.newNoteAttachments = [];
    this.toggleActionViewControl = new FormControl('OPEN');
    this.actionObject = {};
    this.activateObservables();
  }

  get caseObjectType() {
    return this.objectType;
  }

  @Input()
  set caseObjectType(type: string) {
    if (type) {
      this.objectType = type;
      this.caseObjectAbbreviation = this.helpersService.getCaseObjectForms(type).abbr;
    }
  }

  @Input()
  set caseObjectDetails(caseObject) {
    if (caseObject && (caseObject.ID || caseObject.id)) {
      this.caseObject = caseObject;
      this.setFilter();
    }
  }

  ngOnInit() {
    this.actionsMenuSelected = 0;
    this.actionFormConfiguration = this.configurationService.getFormFieldParameters('Action') as ActionFormConfiguration;
    this.actionFormConfiguration.type.options = this.actionFormConfiguration.type.options.filter((res: FormControlEnumeration) => {
      return !(res.value === 'REVIEW' || res.value === 'PROCESS-REVIEW');
    });
  }

  setFilter() {
    this.linkedItem = {
      'ID': this.caseObjectType === 'ReleasePackage' ? this.caseObject['release_package_number'] : this.caseObject['ID'] || this.caseObject['id'] || '',
      'type': this.objectType || '',
      'status': (this.caseObject['generalInformation']) ?
        ((this.caseObject['generalInformation']['status']) ? this.caseObject['generalInformation']['status'] : '') :
        ((this.caseObject['status']) ? this.caseObject['status'] : '') || '',
      'title': this.caseObject['title'] ? this.caseObject['title'] : '',
    };
    if (this.caseObjectType !== 'AgendaItem') {
      this.linkedItem = {...this.linkedItem, 'revision': this.caseObject['revision'] || 'AA'};
    }
    this.filterAction();
  }

  activateObservables(): void {
    this.toggleActionViewControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(() => {
        this.filterAction();
      });
  }

  actionUpdateInProgress(event) {
    this.updateInProgress = event;
  }

  constructNotesFormGroup(): void {
    this.noteFormGroup = this.mcFormGroupService.createNoteFormGroup(this.helpersService.getDefaultNoteObject(this.currentUser));
    this.noteFormGroup.get('note').setValidators(Validators.required);
  }

  updateAction(action, caseAction) {
    let dialogRef;
    if (caseAction === 'REJECT') {
      dialogRef = this.actionDialog.open(ActionRejectDialogComponent, {
        width: '50rem',
        data: {
          title: 'Action Rejected',
          action: action
        }
      });
    } else if (caseAction === 'REMOVE') {
      dialogRef = this.actionDialog.open(ActionDeleteDialogComponent, {
        width: '50rem',
        data: {
          title: 'Are you sure you want to delete this action and all its related comments?'
        }
      });
    } else {
      this.actionService.updateAction(action, caseAction).subscribe(res => {
        this.filterAction();
        this.appStore.dispatch(refreshLinkedItemsCount(true));
      });
      return;
    }
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result !== 1) {
            action['motivation'] = result;
          }
          this.actionService.updateAction(action, caseAction).subscribe(res => {
            this.filterAction();
            this.appStore.dispatch(refreshLinkedItemsCount(true));
          });
        }
      });
    }
  }

  getLinkedList(linkedItemReferer, filterOption, orderBy?, isActionAdded?) {
    this.actionCategoryList = [];
    this.progressBar = true;
    this.actionService.getLinkedActions(linkedItemReferer, filterOption, orderBy)
      .subscribe(res => {
        setTimeout(() => {
          this.handleScroll();
        }, 500);
        this.progressBar = false;
        if (isActionAdded) {
          this.appStore.dispatch(refreshLinkedItemsCount(true));
        }
        this.allActionsCount = res['allActionsCount'];
        this.openAcceptedCount = res['openActionsCount'];
        this.actionCategoryList = res['actionCategoryList'] || [];
      });
  }

  handleScroll(): void {
    if (this.scrollItemId) {
      const scrollElement = this.elementRef.nativeElement.querySelector(`#action-card-${this.scrollItemId}`);
      if (scrollElement && scrollElement.scrollIntoView) {
        scrollElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
    }
  }

  hasActions(): boolean {
    if (this.actionCategoryList && this.actionCategoryList.length > 0) {
      for (const actionCategory of this.actionCategoryList) {
        if (actionCategory.actionSummaries && actionCategory.actionSummaries.length > 0) {
          return true;
        }
      }
    }
    return false;
  }

  filterAction(isActionAdded?): void {
    let status = '';
    if (this.toggleActionViewControl && this.toggleActionViewControl.value === 'ALL') {
      status = '"OPEN", "ACCEPTED", "REJECTED", "COMPLETED"';
    } else {
      status = '"OPEN", "ACCEPTED"';
    }
    const user = new User(this.configurationService.getUserProfile());
    let filterOption =
      ` generalInformation.status in (${status}) or (generalInformation.status {equal} 'DRAFT' and generalInformation.createdBy.userID {equal} '${user.userID}')`;
    if (this.isNonAOBCCBAgendaItem()) {
      const linkedItem = new CaseObject(this.caseObject['linkedObject']['ID'] || this.caseObject['linkedObject']['id'], this.caseObject['linkedObject']['revision'] || 'AA', this.caseObject['linkedObject']['type']);
      filterOption =
        `(((generalInformation.status in (${status})` +
        ` or (generalInformation.status {equal} 'DRAFT' and generalInformation.createdBy.userID {equal} '${user.userID}')) and
        generalInformation.createdOn <= ${this.caseObject['agendaStartDate'] || new Date().toISOString().split('.')[0] + 'Z'} and
        (agendaItem {equal} null or agendaItem.category {equal} 'CCB')) or (agendaItem.ID {equal} ${this.caseObject['ID'] || this.caseObject['id']} and (${filterOption})))`;
      this.getLinkedList(linkedItem, filterOption, 'deadline desc', isActionAdded);
    } else {
      this.getLinkedList(this.linkedItem, filterOption, 'deadline desc', isActionAdded);
    }
    this.filterQuery = filterOption;
  }

  isNonAOBCCBAgendaItem(): boolean {
    return this.caseObjectType === 'AgendaItem' && this.caseObject['category'] === 'CCB' && !this.caseObject['isAOB'];
  }

  addNoteAttachment(noteDocRef, action) {
    const fileList: FileList = noteDocRef.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const formData: FormData = new FormData();
      formData.append('xxxxxx', action.ID);
      formData.append('case-id', action.ID);
      formData.append('case-type', 'Action');
      formData.append('file-name', file, file.name);
      formData.append('case-revision', 'AA');
      this.fileService.uploadFile(formData).subscribe(
        (fileObj: any) => {
          if (fileObj && fileObj.document && fileObj.document.ID) {

            const noteObj = {
              'name': fileObj.document.name,
              'uploadedBy': new User(this.configurationService.getUserProfile()),
              'uploadedOn': fileObj.document.updatedOn || new Date(),
              'ID': fileObj.document.ID,
              'tags': ['note']
            };
            this.newNoteAttachments.push(new Document(noteObj));
          }
        },
        () => {
        });
    }
  }

  editAction(action: Action): void {
    this.actionFormGroup = this.mcFormGroupService.createActionFormGroup(new Action(action));
    this.showActionForm = true;
    this.formActionType = 'edit';
  }

  addAction(): void {
    this.actionFormGroup = this.mcFormGroupService.createActionFormGroup(new Action({}));
    this.showActionForm = true;
    this.formActionType = 'add';
  }

  submitAction(updateActionData: UpdateActionData): void {
    this.updateAction(updateActionData.action, updateActionData.caseAction);
  }

  refreshActions(updatedActionId: string): void {
    this.showActionForm = false;
    this.scrollItemId = updatedActionId;
    this.filterAction(true);
    // this.appStore.dispatch(refreshLinkedItemsCount(true));
  }

  cancelActionUpdate(): void {
    this.showActionForm = false;
  }

  ngOnDestroy() {
    if (this.caseObjectSubscription$) {
      this.caseObjectSubscription$.unsubscribe();
    }
  }

}
