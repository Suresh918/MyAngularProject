import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {DialogPosition, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {ProductBreakdownStructure} from '../../models/product-breakdown-structure.model';
import {MatDialogDeleteConfirmationComponent} from '../mat-dialog-delete-confirmation/mat-dialog-delete-confirmation.component';
import {MCAirPbsExpansionPanelListComponent} from '../mc-air-pbs-expansion-panel-list/mc-air-pbs-expansion-panel-list.component';
import {ChangeRequestService} from '../../../change-request/change-request.service';
import {ImportAirPbsIssuesDialogComponent} from '../../../change-request/shared/import-air-pbs-issues-dialog/import-air-pbs-issues-dialog.component';

@Component({
  selector: 'mc-expansion-panel-list-pbs',
  templateUrl: './mc-expansion-panel-list-pbs.component.html',
  styleUrls: ['./mc-expansion-panel-list-pbs.component.scss'],
  providers: [ChangeRequestService]
})
export class McExpansionPanelListPbsComponent extends MCAirPbsExpansionPanelListComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  fontsize: string;
  @Input()
  AIRItems: any[];
  @Input()
  PBSItem: any[];
  @Output()
  readonly fetchCrDetailsOnLinkingPbs: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  set agendaItemId(agendaItemID: string) {
    if (agendaItemID) {
      this.agendaItemIDValue = agendaItemID;
      this.getPBSListForLinkedObjectOfAI();
    }
  }
  get agendaItemId(): string {
    return this.agendaItemIDValue;
  }
  agendaItemIDValue: string;
  itemsList: ProductBreakdownStructure[];
  dialogRef: MatDialogRef<ImportAirPbsIssuesDialogComponent>;
  pbsDeleteButtonSubscriptions: Subscription[];

  ngOnInit() {
    this.itemsList = [];
    this.deepLinkUrl = this.configurationService.getLinkUrl('PBS');
    this.imageUrl = window.location.origin + '/assets/images/pbs.png';
    this.header = 'PBS Item';
    this.pbsDeleteButtonSubscriptions = [];
    super.ngOnInit();
    if (this.changeRequestID) {
      this.getPBSListOnCRID(this.changeRequestID);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.PBSItem && changes.PBSItem.currentValue && changes.PBSItem.currentValue.length > 0 && this.itemsList && this.itemsList.length === 0) {
      this.itemsList = changes.PBSItem.currentValue.map((Item) => {
        if (Item) {
          return {'id': Item.context_id};
        }
      });
      this.createItemList();
    }
    if (changes.openDialog && changes.openDialog.currentValue) {
      this.onAddPBSItem('pbs');
    }
  }

  getPBSListForLinkedObjectOfAI() {
    this.isBusy = true;
    this.agendaItemService.getPBSItems(this.agendaItemId).subscribe(resPBSList => {
      this.handlePBSList(resPBSList);
    }, (err) => {
      this.handleError(err);
      this.handlePBSList(this.PBSItem);
    });
  }

  createItemList() {
    this.unsubscribeDeleteActions(this.pbsDeleteButtonSubscriptions);
    this.pbsDeleteButtonSubscriptions = [];
    this.expansionPanelItemConfigurationList = this.itemsList.map((pbsItem: ProductBreakdownStructure) => {
      const expansionPanelItemConfiguration = new ExpansionPanelItemConfiguration();
      expansionPanelItemConfiguration.ID = pbsItem.id || pbsItem.context_id;
      expansionPanelItemConfiguration.title = pbsItem.status ? ((pbsItem.id || pbsItem.context_id) + ' · ' + pbsItem.status) : (pbsItem.id || pbsItem.context_id);
      expansionPanelItemConfiguration.mainDescription = pbsItem.deliverable || pbsItem.name;
      expansionPanelItemConfiguration.line1 = pbsItem.projectID;
      expansionPanelItemConfiguration.isClickable = true;
      expansionPanelItemConfiguration.imageURL = this.imageUrl;
      if (pbsItem.errorInServiceCall) {
        expansionPanelItemConfiguration.error = new Info(pbsItem.errorInServiceCall);
      }

      expansionPanelItemConfiguration.actionButtonConfiguration = new ActionButtonConfiguration();
      expansionPanelItemConfiguration.actionButtonConfiguration.action = 'delete';
      expansionPanelItemConfiguration.actionButtonConfiguration.actionButtonIcon = 'delete';
      expansionPanelItemConfiguration.actionButtonConfiguration.actionButtonType = 'icon';
      expansionPanelItemConfiguration.actionButtonConfiguration.actionButtonTooltip = 'Remove item';
      expansionPanelItemConfiguration.actionButtonConfiguration.showActionButton =
        expansionPanelItemConfiguration.actionButtonConfiguration.showActionButton || !!pbsItem.errorInServiceCall;
      expansionPanelItemConfiguration.showActionButtonOnFocus = true;
      if (this.changeRequestFormGroup && !this.changeRequestFormGroup.disabled && this.deleteButtonAction$) {
        this.pbsDeleteButtonSubscriptions.push(this.deleteButtonAction$.subscribe(isAllowed => {
          expansionPanelItemConfiguration.actionButtonConfiguration.showActionButton = isAllowed;
        }));
      }
      return expansionPanelItemConfiguration;
    });
  }

  getPBSListOnCRID(id: string): void {
    this.isBusy = true;
    this.changeRequestsService.getPBSListOnCRID(id).subscribe(resPBSList => {
      this.handlePBSList(resPBSList);
    }, (err) => {
      this.handleError(err);
      this.handlePBSList(this.PBSItem);
    });
  }

  handlePBSList(resPBSList: ProductBreakdownStructure[]) {
    if (resPBSList && resPBSList.length > 0 && resPBSList[0] !== null && (resPBSList[0].id || resPBSList[0].context_id)) {
      this.itemsList = resPBSList;
      this.createItemList();
    }
    this.isBusy = false;
  }

  onAddPBSItem(from?: string) {
    this.dialogRef = this.matDialog.open(ImportAirPbsIssuesDialogComponent, {
      width: '80rem',
      disableClose: true,
      data: {
        'pbsItem': this.PBSItem,
        'airItems': this.AIRItems,
        'changeRequestID': this.changeRequestFormGroup.get('id').value,
        'trigger': from // expected values: 'pbs' - from menu, 'addPBS' - on + icon click
      },
      position: {top: '3rem'} as DialogPosition
    });
    this.dialogRef.afterClosed().subscribe(result => {
      if (result && result.length > 0) {
        if (this.openDialog) {
          window.open('/change-requests/' + this.changeRequestFormGroup.get('id').value, '_self');
        } else {
          this.getPBSListOnCRID(this.changeRequestID);
          this.fetchCrDetailsOnLinkingPbs.emit();
        }
      } else if (result && (result.linkError || result.importError)) {
        this.handleError('');
      }
    });
  }

  onDeleteItem(item) {
    let dialogRef: MatDialogRef<MatDialogDeleteConfirmationComponent>;
    const selectedItemConfiguration = this.expansionPanelItemConfigurationList.filter(pbsItem => item.ID === pbsItem.ID) [0];
    dialogRef = this.matDialog.open(MatDialogDeleteConfirmationComponent, {
      width: '50rem',
      data: {
        title: 'Are you sure you want to delete PBS Issue?',
        targetId: item.ID
      }
    });
    dialogRef.afterClosed().subscribe(pbsIDToBeDelete => {
      if (pbsIDToBeDelete && this.changeRequestFormGroup.get('id') && this.changeRequestFormGroup.get('id').value) {
        selectedItemConfiguration['isBusy'] = true;
        this.changeRequestService.unlinkPBS$(pbsIDToBeDelete, this.changeRequestFormGroup.get('id').value).subscribe((res) => {
          if (res) {
            this.itemsList = this.itemsList.filter(pbsItem => {
              return pbsItem.id !== pbsIDToBeDelete;
            });
            this.changeRequestFormGroup.setControl('contexts', this.fb.array(res));
            this.getPBSListOnCRID(this.changeRequestID);
          }
          selectedItemConfiguration['isBusy'] = false;
          this.createItemList();
          this.isBusy = false;
        }, (err) => {
          this.itemsList.filter(pbsItem => pbsItem.id === pbsIDToBeDelete)[0].errorInServiceCall = this.changeRequestService.getErrorMessage(err);
          selectedItemConfiguration['isBusy'] = false;
          this.createItemList();
          this.isBusy = false;
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeDeleteActions(this.pbsDeleteButtonSubscriptions);
  }
}
