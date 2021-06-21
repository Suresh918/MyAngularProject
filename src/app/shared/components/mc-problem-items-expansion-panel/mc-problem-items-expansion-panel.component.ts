import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CaseActionDetail, CaseObject, CasePermissions, ImpactedItem} from '../../models/mc.model';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ImpactedItemDialogComponent} from '../impacted-item-dialog/impacted-item-dialog.component';
import {FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {myTeamListValue} from '../../../change-request/store';
import {ChangeRequestService} from '../../../change-request/change-request.service';
import {Store} from '@ngrx/store';
import {ChangeRequestListState, MyChangeState} from '../../models/mc-store.model';
import {ImpactedItemService} from '../../../core/services/impacted-item.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CaseAction} from '../../models/case-action.model';
import {loadCaseActions} from '../../../store/actions/case-object.actions';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';

@Component({
  selector: 'mc-problem-items-expansion-panel',
  templateUrl: './mc-problem-items-expansion-panel.component.html',
  styleUrls: ['./mc-problem-items-expansion-panel.component.scss']
})
export class MCProblemItemsExpansionPanelComponent implements OnInit {
  problemItemsList: ImpactedItem[];
  @Input()
  set problemItemsData(data: ImpactedItem[]) {
    if (data && data.length) {
      this.problemItemsList = data;
      this.setUsersData();
      this.handleProblemItemsCaseActions(data);
    }
  }
  get problemItemsData() {
    return this.problemItemsList;
  }
  @Input()
  isExpanded: boolean;
  @Input()
  hideChangeOwnerPanel: boolean;
  @Input()
  changeRequestFormGroup: FormGroup;
  @Input()
  helpMessage: string;
  @Output()
  readonly updateChangeOwnerField: EventEmitter<any> = new EventEmitter<any>();
  updatedIndex: number;
  problemItemsCaseActionsList: any[];
  impactedItemDialogUpdate$: Subject<any> = new Subject<any>();
  constructor(public readonly matDialog: MatDialog,
              private readonly changeRequestService: ChangeRequestService,
              private readonly impactedItemService: ImpactedItemService,
              private readonly matSnackBar: MatSnackBar,
              private readonly helpersService: HelpersService,
              private readonly appStore: Store<MyChangeState>,
              private readonly changeRequestListStore: Store<ChangeRequestListState>) {
    this.updatedIndex = 0;
    this.problemItemsCaseActionsList = [];
    this.problemItemsList = [];
  }

  ngOnInit(): void {

  }

  handleProblemItemsCaseActions(problemItemsList: ImpactedItem[]) {
    const caseAction = {};
    this.problemItemsCaseActionsList = [];
    const tempCaseActionsList = JSON.parse(JSON.stringify(problemItemsList));
    tempCaseActionsList.forEach(item => {
      item['case_permissions']['case_actions'].forEach((caseActionObj) => {
        caseAction[caseActionObj['case_action']] = caseActionObj['is_allowed'];
      });
      this.problemItemsCaseActionsList.push(JSON.parse(JSON.stringify(caseAction)));
    });
    for (let count = 0; count < problemItemsList.length; count++) {
      this.problemItemsData[count]['caseObject'] = new CaseObject(problemItemsList[count].id.toString(), '', 'ProblemItem');
      this.storeProblemItemsCaseActions(problemItemsList[count]['case_permissions'], problemItemsList[count].id.toString());
    }
  }

  storeProblemItemsCaseActions(casePermissions: CasePermissions, problemItemId: string) {
    const caseActionsAllowed = [];
    const caseActions: CaseActionDetail[] = casePermissions.case_actions;
    caseActions.forEach(caseAction => {
      caseActionsAllowed.push(new CaseAction(problemItemId, '',
        'ProblemItem', caseAction.is_allowed, caseAction.case_action, caseAction.mandatory_properties_regexps));
    });
    this.appStore.dispatch(loadCaseActions({caseActions: caseActionsAllowed}));
  }

  openProblemItemDialog(item?: ImpactedItem, mode?: string) {
    if (mode === 'EDIT') {
      this.updatedIndex = item.sequence - 1;
    }
    let dialogRef: MatDialogRef<ImpactedItemDialogComponent>;
    dialogRef = this.matDialog.open(ImpactedItemDialogComponent, {
      width: '70rem',
      data: {
        category: 'PROBLEMITEM',
        categoryLabel: 'Problem',
        caseObjectID: this.changeRequestFormGroup.get('id').value,
        caseObjectType: 'ChangeRequest',
        caseObjectData: this.changeRequestFormGroup.value,
        mode: mode,
        item: item ? item : {},
        impactedItemDialogUpdate: this.impactedItemDialogUpdate$,
        itemsLength: this.problemItemsData ? this.problemItemsData.length : 0,
        isInstance: true
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.problemItemsData = res.problem_items;
        this.setUsersData();
        this.handleProblemItemsCaseActions(res.problem_items);
        this.updateChangeOwner(this.problemItemsData);
        this.updateMyTeamList(res);
      }
    });
    dialogRef.componentInstance.getDialogDetails.subscribe((direction: string) => {
      const comingIndex = (direction === 'NEXT') ?
        (((this.updatedIndex + 1) > (this.problemItemsData.length - 1)) ? this.updatedIndex : (this.updatedIndex + 1)) :
        ((this.updatedIndex - 1) < 0 ? 0 : (this.updatedIndex - 1));
      this.updatedIndex = comingIndex;
      dialogRef.componentInstance.data.item = this.problemItemsData[comingIndex];
      this.impactedItemDialogUpdate$.next();
    });
    dialogRef.componentInstance.setNavigations.subscribe(() => {
      dialogRef.componentInstance.data.disablePrevious = false;
      dialogRef.componentInstance.data.disableNext = false;
      if (this.problemItemsData.length <= 1) {
        dialogRef.componentInstance.data.disablePrevious = true;
        dialogRef.componentInstance.data.disableNext = true;
      } else if ((this.updatedIndex + 1) > (this.problemItemsData.length - 1)) {
        dialogRef.componentInstance.data.disableNext = true;
      } else if ((this.updatedIndex - 1) < 0) {
        dialogRef.componentInstance.data.disablePrevious = true;
      }
    });
  }

  updateMyTeamList(impactedItemList) {
    this.changeRequestService.updateMyTeamOnImpactItemChange$(
      this.changeRequestFormGroup.get('id').value,
      impactedItemList['my_team']['members']
    ).subscribe((res) => {
      this.changeRequestFormGroup.get('my_team').patchValue(res);
      this.changeRequestListStore.dispatch(myTeamListValue(res));
    });
  }

  getMyTeamPayLoad(impactedItemList: ImpactedItem[]) {
    const payloadList = [];
    impactedItemList.forEach((item) => {
      payloadList.push({
        'creators': item.creators,
        'users': item.users,
        'is_change_owner': item.is_change_owner
      });
    });
    return payloadList;
  }

  deleteProblemItem(id) {
    this.impactedItemService.deleteImpactedItem(id, 'problem-items').subscribe((res) => {
      this.problemItemsData = res.problem_items;
      this.updateChangeOwner(this.problemItemsData);
      this.handleProblemItemsCaseActions(res.problem_items);
      this.setUsersData();
      this.matSnackBar.open(`Problem Item with ID: ${id} deleted`, '', {duration: 2000});
    });
  }

  onChangeOwner(problemItem) {
    const payload = {
      'oldIns': {
        'is_change_owner': problemItem.is_change_owner
      },
      'newIns': {
        'is_change_owner': !(problemItem.is_change_owner)
      }
    };
    this.impactedItemService.updateChangeOwner(JSON.stringify(problemItem.id), 'ChangeRequest', 'problem-items', payload).subscribe(res => {
      if (res) {
        this.problemItemsData = res.problem_items;
        this.setUsersData();
        this.handleProblemItemsCaseActions(res.problem_items);
        this.updateChangeOwner(this.problemItemsData);
        this.updateMyTeamList(res);
      }
    });
  }

  updateChangeOwner(problemsItemList) {
    const value = problemsItemList.filter(item => item.is_change_owner === true)[0];
    this.updateChangeOwnerField.emit(value);
  }

  setUsersData() {
    this.problemItemsList.forEach(item => {
      item['displayedUsers'] = '';
    });
    this.problemItemsData.forEach(item => {
      if (item.users) {
        item.users.forEach(user => {
          item['displayedUsers'] = item['displayedUsers'] ? item['displayedUsers'] + this.helpersService.transformUserName(user) + ', ' : this.helpersService.transformUserName(user) + ', ';
        });
      }
      item['displayedUsers'] = item['displayedUsers'] ? item['displayedUsers'].slice(0, -2) : '';
    });
  }

}
