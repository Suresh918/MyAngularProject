import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {DialogPosition, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {
  ChangeRequestFormConfiguration,
  FormControlConfiguration,
  FormControlEnumeration
} from '../../../../shared/models/mc-configuration.model';
import {
  CaseActionDetail,
  CaseObject,
  CasePermissions,
  ChangeRequest,
  ImpactedItem
} from '../../../../shared/models/mc.model';
import {
  CaseObjectLabel,
  CaseObjectRouterPath,
  CaseObjectServicePath
} from '../../../../shared/components/case-object-list/case-object.enum';
import {CreatorMatDialogLinkedChangeRequestsComponent} from './creator-mat-dialog-linked-change-requests/creator-mat-dialog-linked-change-requests.component';
import {ChangeRequestService} from '../../../change-request.service';
import {MatDialogDeleteConfirmationComponent} from '../../../../shared/components/mat-dialog-delete-confirmation/mat-dialog-delete-confirmation.component';
import {HelpersService} from '../../../../core/utilities/helpers.service';
import {ManageProductsAffectedService} from '../../../../admin/products-affected/products-affected.service';
import {CaseObjectListService} from '../../../../core/services/case-object-list.service';
import {CreatorChangeRequestDefineScopeDialogComponent} from './creator-change-request-define-scope-dialog/creator-change-request-define-scope-dialog.component';
import {ImpactedItemDialogComponent} from '../../../../shared/components/impacted-item-dialog/impacted-item-dialog.component';
import {Subject} from 'rxjs';
import {ImpactedItemService} from '../../../../core/services/impacted-item.service';
import {myTeamListValue} from '../../../store';
import {Store} from '@ngrx/store';
import {ChangeRequestListState, MyChangeState} from '../../../../shared/models/mc-store.model';
import {CaseAction} from '../../../../shared/models/case-action.model';
import {loadCaseActions} from '../../../../store/actions/case-object.actions';

@Component({
  selector: 'mc-creator-change-request-define-solution',
  templateUrl: './creator-change-request-define-solution.component.html',
  styleUrls: ['./creator-change-request-define-solution.component.scss']
})

export class CreatorChangeRequestDefineSolutionComponent implements OnInit, OnChanges {
  @Input()
  caseActions: string[];
  @Input()
  changeRequestFormGroup: FormGroup;
  @Input()
  changeRequestDocumentsFormGroup: FormGroup;
  @Input()
  changeRequestConfiguration: ChangeRequestFormConfiguration;
  @Input()
  changeRequestData: ChangeRequest;
  @Input()
  linkedSolutionItems: ImpactedItem[];
  @Input()
  pictureUrl: string;
  @Input()
  caseObject: CaseObject;
  @Input()
  solutionItemsCaseActionsList: any[];
  @Input()
  changeObjectCaseActionsForCR: any[];
  hardWareDependenciesShowDesForOptions: string[];
  softWareDependenciesShowDesForOptions: string[];
  testAndReleaseStrategyShowDesForOptions: string[];
  HWSWDepenAlignedShowDesForOptions: string[];
  asIsPictureControlConfiguration: FormControlConfiguration;
  toBePictureControlConfiguration: FormControlConfiguration;
  @Output() private readonly crLinkUnlinkEvent: EventEmitter<ChangeRequest> = new EventEmitter();
  @Output() readonly scopeDataUpdated: EventEmitter<any> = new EventEmitter<any>();
  @Output() private readonly problemItemsUpdated: EventEmitter<ImpactedItem[]> = new EventEmitter();
  @Output() private readonly updateChangeOwnerField: EventEmitter<any> = new EventEmitter<any>();
  @Output() private readonly reloadSolutionItems: EventEmitter<any> = new EventEmitter<any>();
  @Output() private readonly reloadProblemItems: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  isExpanded: boolean;
  @Input()
  showDefineScopeAlert: boolean;
  viewQuery: string;
  caseObjectLabel: string;
  caseObjectType: string;
  caseObjectRouterPath: string;
  caseObjectListOverview: any[];
  alignedWithFOShowDescForOptions: string[];
  caseObjectListId: string[];
  isFunctionHWSWDependencies: boolean;
  scopeEnum: FormControlEnumeration[];
  productsList: string[];
  updatedIndex: number;
  impactedItemDialogUpdate$: Subject<any> = new Subject<any>();

  constructor(private readonly linkedChangeRequestsDialog: MatDialog, private readonly deleteDialog: MatDialog,
              private readonly changeRequestService: ChangeRequestService,
              private readonly productsAffectedService: ManageProductsAffectedService,
              private readonly caseObjectListService: CaseObjectListService,
              private readonly impactedItemService: ImpactedItemService,
              public readonly matDialog: MatDialog,
              public readonly appStore: Store<MyChangeState>,
              private readonly changeRequestListStore: Store<ChangeRequestListState>) {
    this.caseActions = [];
    this.asIsPictureControlConfiguration = {
      'placeholder': 'As Is Picture',
      'label': 'As Is Picture',
      'help': '',
      'hint': '',
      'tag': 'asIsPicture'
    };
    this.toBePictureControlConfiguration = {
      'placeholder': 'To Be Picture',
      'label': 'To Be Picture',
      'help': '',
      'hint': '',
      'tag': 'toBePicture'
    };
    this.hardWareDependenciesShowDesForOptions = ['YES'];
    this.softWareDependenciesShowDesForOptions = ['YES'];
    this.HWSWDepenAlignedShowDesForOptions = ['NO'];
    this.alignedWithFOShowDescForOptions = ['NO'];
    this.testAndReleaseStrategyShowDesForOptions = ['RELEASE-QUALIFY', 'QUALIFY-RELEASE', 'NO-QUALIFICATION-REQUIRED'];
    this.caseObjectListId = [];
    this.caseObjectListOverview = [];
  }

  ngOnInit() {
    this.getProductsAffectedList();
    this.caseObjectType = 'ChangeRequest';
    this.caseObjectLabel = CaseObjectLabel[this.caseObjectType];
    this.caseObjectRouterPath = CaseObjectRouterPath[this.caseObjectType];
    this.scopeEnum = this.changeRequestConfiguration.scope.part_detail.machine_bom_part.options;
  }

  getLabel(value) {
    if (value && this.scopeEnum) {
      return this.scopeEnum.filter((scopeValue) => scopeValue.value === value)[0].label;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.changeRequestFormGroup && changes.changeRequestFormGroup.currentValue && changes.changeRequestFormGroup.currentValue.value.dependent_change_request_ids && changes.changeRequestFormGroup.currentValue.value.dependent_change_request_ids.length > 0) {
      const changeRequestIDList = changes.changeRequestFormGroup.currentValue.value.dependent_change_request_ids;
      this.caseObjectListId = changeRequestIDList;
      this.viewQuery = changeRequestIDList.length > 1 ? `id@${changeRequestIDList.join(',')}` : `id:${changeRequestIDList.join(',')}`;
      this.caseObjectListService.getOverviewSummary$(CaseObjectServicePath[this.caseObjectType], 0, 20, '', this.viewQuery).subscribe((response) => {
        if (response && response.results) {
          this.caseObjectListOverview = response.results;
        }
      });
    }
    this.isFunctionHWSWDependencies = (this.changeRequestFormGroup.get('solution_definition.functional_hardware_dependencies').value === 'YES') || (this.changeRequestFormGroup.get('solution_definition.functional_software_dependencies').value === 'YES');
  }

  changeRequestLinkEvent(event) {
    this.crLinkUnlinkEvent.emit(event);
  }

  onDeleteItem(changeRequestId): void {
    this.deleteChangeRequest(changeRequestId);
  }

  onAddItem(): void {
    this.openChangeRequestAddDialog();
  }

  openChangeRequestAddDialog(): void {
    let dialogRef: MatDialogRef<CreatorMatDialogLinkedChangeRequestsComponent>;
    dialogRef = this.linkedChangeRequestsDialog.open(CreatorMatDialogLinkedChangeRequestsComponent, {
      width: '50rem',
      data: {
        workingChangeRequestID: this.changeRequestFormGroup.value.id,
        caseObjectListId: this.caseObjectListId,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.length > 0) {
        this.changeRequestService.linkChangeRequests(this.changeRequestFormGroup.get('dependent_change_request_ids').value, (this.changeRequestFormGroup.get('dependent_change_request_ids').value).concat(JSON.stringify(result[0].ID)), this.changeRequestFormGroup.value.id).subscribe((res: ChangeRequest) => {
          if (res && res.id) {
            this.caseObjectListService.getOverviewSummary$(CaseObjectServicePath[this.caseObjectType], 0, 20, '', this.viewQuery === undefined ? `id:${result[0].ID}` : this.viewQuery).subscribe((response) => {
                if (response && response.results) {
                  this.caseObjectListOverview = response.results;
                  this.changeRequestFormGroup.get('dependent_change_request_ids').setValue(res.dependent_change_request_ids);
                  this.crLinkUnlinkEvent.emit({...this.changeRequestFormGroup.getRawValue(), ...res});
                }
            });
          }
        });
      }
    });
  }

  deleteChangeRequest(id: string): void {
    let dialogRef: MatDialogRef<MatDialogDeleteConfirmationComponent>;
    dialogRef = this.deleteDialog.open(MatDialogDeleteConfirmationComponent, {
      width: '50rem',
      data: {
        title: 'Are you sure you want to remove this CR from the list of Dependent CRs?',
        targetId: id,
        notification: 'no-warning'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.changeRequestService.unlinkChangeRequests(this.changeRequestFormGroup.get('dependent_change_request_ids').value, this.changeRequestFormGroup.get('dependent_change_request_ids').value.filter((crId) => crId !== JSON.stringify(result)) , this.changeRequestFormGroup.value.id).subscribe((res) => {
          if (res) {
            const updatedLinkedCRIds = this.changeRequestFormGroup.get('dependent_change_request_ids').value.filter((crId) => crId !== JSON.stringify(result));
            this.changeRequestFormGroup.get('dependent_change_request_ids').setValue(updatedLinkedCRIds);
            this.caseObjectListService.getOverviewSummary$(
              CaseObjectServicePath[this.caseObjectType], 0, 20, '', this.viewQuery).subscribe((response) => {
              if (response && response.results) {
                this.caseObjectListOverview = response.results;
                this.crLinkUnlinkEvent.emit({...this.changeRequestFormGroup.getRawValue(), ...res});
              }
            });
          }
        });
      }
    });
  }

  isCaseObjectInFinalState(): boolean {
    return HelpersService.isCaseObjectInFinalState('ChangeRequest', this.changeRequestFormGroup.get('status').value);
  }

  updateDescription(data) {
    this.changeRequestFormGroup.get('aligned_with_fo_details').setValue(data.ChangeRequestElement.alignedWithFODet);
  }

  onCaseObjectListIdPanel($event) {
    this.caseObjectListId = $event;
  }

  onFunctionalHWSWfieldUpdate(data) {
    this.isFunctionHWSWDependencies = (data.functional_hardware_dependencies === 'YES') || (data.functional_software_dependencies === 'YES');
  }

  openDefineScopeDialog(): void {
    let dialogRef: MatDialogRef<CreatorChangeRequestDefineScopeDialogComponent>;
    dialogRef = this.matDialog.open(CreatorChangeRequestDefineScopeDialogComponent, {
      width: '80rem',
      disableClose: true,
      data: {
        changeRequestConfiguration: this.changeRequestConfiguration,
        changeRequestFormGroup: this.changeRequestFormGroup
      },
      position: {top: '3rem'} as DialogPosition
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.scopeDataUpdated.emit(data);
        this.showDefineScopeAlert = false;
      }
    });
  }

  getProductsAffectedList() {
    const productsList = [];
    this.productsAffectedService.getProductCategories().subscribe(res => {
      if (res) {
        res.forEach((product) => {
          product.products.forEach((value) => {
            productsList.push(value.name);
          });
        });
        this.productsList = productsList;
      }
    });
  }

  openSolutionItemDialog(item?: ImpactedItem, mode?: string) {
    if (mode === 'EDIT') {
      this.updatedIndex = item.sequence - 1;
    }
    let dialogRef: MatDialogRef<ImpactedItemDialogComponent>;
    dialogRef = this.matDialog.open(ImpactedItemDialogComponent, {
      width: '70rem',
      data: {
        category: 'SOLUTIONITEM',
        categoryLabel: 'Scope',
        caseObjectID: this.changeRequestFormGroup.get('id').value,
        caseObjectData: this.changeRequestFormGroup.value,
        caseObjectType: 'ChangeRequest',
        mode: mode,
        item: item ? item : {},
        changeOwnerType: 'CREATOR',
        impactedItemDialogUpdate: this.impactedItemDialogUpdate$,
        itemsLength: this.linkedSolutionItems ? this.linkedSolutionItems.length : 0,
        isInstance: true
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.linkedSolutionItems = res.scope_items;
        this.reloadProblemItems.emit();
        this.updateChangeOwner(this.linkedSolutionItems);
        this.updateMyTeamList(res);
      }
    });
    dialogRef.componentInstance.getDialogDetails.subscribe((direction: string) => {
      const comingIndex = (direction === 'NEXT') ?
        (((this.updatedIndex + 1) > (this.linkedSolutionItems.length - 1)) ? this.updatedIndex : (this.updatedIndex + 1)) :
        ((this.updatedIndex - 1) < 0 ? 0 : (this.updatedIndex - 1));
      this.updatedIndex = comingIndex;
      dialogRef.componentInstance.data.item = this.linkedSolutionItems[comingIndex];
      this.impactedItemDialogUpdate$.next();
    });
    dialogRef.componentInstance.setNavigations.subscribe(() => {
      dialogRef.componentInstance.data.disablePrevious = false;
      dialogRef.componentInstance.data.disableNext = false;
      if (this.linkedSolutionItems.length <= 1) {
        dialogRef.componentInstance.data.disablePrevious = true;
        dialogRef.componentInstance.data.disableNext = true;
      } else if ((this.updatedIndex + 1) > (this.linkedSolutionItems.length - 1)) {
        dialogRef.componentInstance.data.disableNext = true;
      } else if ((this.updatedIndex - 1) < 0) {
        dialogRef.componentInstance.data.disablePrevious = true;
      }
    });
  }

  onOwnerChange(item) {
    const payload = {
      'oldIns': {
        'is_change_owner': item.is_change_owner
      },
      'newIns': {
        'is_change_owner': !(item.is_change_owner)
      }
    };
    this.impactedItemService.updateChangeOwner(JSON.stringify(item.id), 'ChangeRequest', 'scope-items', payload).subscribe(res => {
      if (res) {
        this.linkedSolutionItems = res.scope_items;
        this.problemItemsUpdated.emit(res.problem_items);
        this.reloadProblemItems.emit();
        this.updateChangeOwner(this.linkedSolutionItems);
        this.updateMyTeamList(res);
      }
    });
  }

  updateChangeOwner(solutionItemList) {
    const value = solutionItemList.filter(item => item.is_change_owner === true)[0];
    this.updateChangeOwnerField.emit(value);
  }

  updateMyTeamList(impactedItemList) {
    this.changeRequestService.updateMyTeamOnImpactItemChange$(
      this.changeRequestFormGroup.get('id').value, impactedItemList['my_team']['members']
    ).subscribe((res) => {
      this.changeRequestFormGroup.get('my_team').patchValue(res);
      this.changeRequestListStore.dispatch(myTeamListValue(res));
    });
  }

  storeSolutionItemsCaseActions(casePermissions: CasePermissions, solutionItemId: string) {
    const caseActionsAllowed = [];
    const caseActions: CaseActionDetail[] = casePermissions.case_actions;
    caseActions.forEach(caseAction => {
      caseActionsAllowed.push(new CaseAction(solutionItemId, '',
        'SolutionItem', caseAction.is_allowed, caseAction.case_action, caseAction.mandatory_properties_regexps));
    });
    this.appStore.dispatch(loadCaseActions({caseActions: caseActionsAllowed}));
  }

  fetchSolutionItems() {
    this.reloadSolutionItems.emit();
    this.reloadProblemItems.emit();
  }
}

