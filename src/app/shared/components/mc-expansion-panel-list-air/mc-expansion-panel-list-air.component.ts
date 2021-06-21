import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {DialogPosition, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {Problem} from '../../models/air.model';
import {MatDialogDeleteConfirmationComponent} from '../mat-dialog-delete-confirmation/mat-dialog-delete-confirmation.component';
import {MCAirPbsExpansionPanelListComponent} from '../mc-air-pbs-expansion-panel-list/mc-air-pbs-expansion-panel-list.component';
import {ChangeRequestService} from '../../../change-request/change-request.service';
import {PersonNamePipe} from '../../pipes/person-name.pipe';
import {ImportAirPbsIssuesDialogComponent} from '../../../change-request/shared/import-air-pbs-issues-dialog/import-air-pbs-issues-dialog.component';

@Component({
  selector: 'mc-expansion-panel-list-air',
  templateUrl: './mc-expansion-panel-list-air.component.html',
  styleUrls: ['./mc-expansion-panel-list-air.component.scss'],
  providers: [ChangeRequestService]
})
export class McExpansionPanelListAirComponent extends MCAirPbsExpansionPanelListComponent implements OnInit, OnChanges, OnDestroy {
  isBusy: boolean;
  @Input()
  fontsize: string;
  @Input()
  AIRItems: any[];
  @Input()
  PBSItem: any[];
  @Input()
  set agendaItemId(agendaItemID: string) {
    if (agendaItemID) {
      this.agendaItemIDValue = agendaItemID;
      this.getAirListForLinkedObjectOfAI();
    }
  }
  get agendaItemId(): string {
    return this.agendaItemIDValue;
  }
  agendaItemIDValue: string;
  itemsList: Problem[];
  importAirDialogRef: MatDialogRef<ImportAirPbsIssuesDialogComponent>;
  airDeleteButtonSubscriptions: Subscription[];

  ngOnInit() {
    this.itemsList = [];
    this.deepLinkUrl = this.configurationService.getLinkUrl('AIR');
    this.imageUrl = window.location.origin + '/assets/images/air.png';
    this.header = 'AIR Issues';
    this.airDeleteButtonSubscriptions = [];
    super.ngOnInit();
    if (this.changeRequestID) {
      this.getAirListOnCRID(this.changeRequestID);
    }
  }

  getAirListForLinkedObjectOfAI() {
    this.isBusy = true;
    this.agendaItemService.getAIRItems(this.agendaItemId).subscribe(resProblemList => {
      this.handleAIRList(resProblemList);
    }, (err) => {
      this.handleError(err);
      this.handleAIRList(this.AIRItems);
    });
  }

  handleAIRList(resProblemList: Problem[]) {
    if (resProblemList.length > 0 && resProblemList[0] !== null && (resProblemList[0].number || resProblemList[0].context_id)) {
      this.itemsList = resProblemList;
      this.createItemList();
    }
    this.isBusy = false;
  }

  createItemList() {
    this.unsubscribeDeleteActions(this.airDeleteButtonSubscriptions);
    this.airDeleteButtonSubscriptions = [];
    const personNamePipe = new PersonNamePipe();
    this.expansionPanelItemConfigurationList = this.itemsList.map((airProblem: any) => {
      const expansionPanelItemConfiguration = new ExpansionPanelItemConfiguration();
      expansionPanelItemConfiguration.ID = airProblem.number || airProblem.context_id || airProblem;
      expansionPanelItemConfiguration.title = airProblem.number || airProblem.context_id;
      expansionPanelItemConfiguration.mainDescription = airProblem.short_description || airProblem.name;
      expansionPanelItemConfiguration.line1 = personNamePipe.transform(airProblem.owner);
      expansionPanelItemConfiguration.isClickable = true;
      expansionPanelItemConfiguration.imageURL = this.imageUrl;
      if (airProblem.errorInServiceCall) {
        expansionPanelItemConfiguration.error = new Info(airProblem.errorInServiceCall);
      }
      expansionPanelItemConfiguration.actionButtonConfiguration = new ActionButtonConfiguration();
      expansionPanelItemConfiguration.actionButtonConfiguration.action = 'delete';
      expansionPanelItemConfiguration.actionButtonConfiguration.actionButtonIcon = 'delete';
      expansionPanelItemConfiguration.actionButtonConfiguration.actionButtonType = 'icon';
      expansionPanelItemConfiguration.actionButtonConfiguration.actionButtonTooltip = 'Remove link';
      expansionPanelItemConfiguration.actionButtonConfiguration.showActionButton =
        expansionPanelItemConfiguration.actionButtonConfiguration.showActionButton || !!airProblem.errorInServiceCall;
      expansionPanelItemConfiguration.showActionButtonOnFocus = true;
      if (this.changeRequestFormGroup && !this.changeRequestFormGroup.disabled && this.deleteButtonAction$) {
        this.airDeleteButtonSubscriptions.push(this.deleteButtonAction$.subscribe(isAllowed => {
          expansionPanelItemConfiguration.actionButtonConfiguration.showActionButton = isAllowed;
        }));
      }
      return expansionPanelItemConfiguration;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.changeRequestFormGroup && changes.changeRequestFormGroup.currentValue) {
      if (changes.AIRItems && changes.AIRItems.currentValue.length > 0 && this.itemsList && this.itemsList.length === 0) {
        this.itemsList = changes.AIRItems.currentValue.map((AIRItem) => {
          if (AIRItem) {
            return {'number': AIRItem.context_id};
          }
        });
        this.createItemList();
      }
      if (changes.changeRequestFormGroup.currentValue.value['id'] &&
        this.importAirDialogRef && this.importAirDialogRef.componentInstance && this.importAirDialogRef.componentInstance.data) {
        this.importAirDialogRef.componentInstance.data.changeRequestID = changes.changeRequestFormGroup.currentValue.value['id'];
      }
    }
    if (changes.openDialog && changes.openDialog.currentValue) {
      this.openAIRDialog();
    }
  }

  getAirListOnCRID(id: string): void {
    this.isBusy = true;
    this.changeRequestsService.getAirListOnCRID(id).subscribe(resProblemList => {
      this.handleAIRList(resProblemList);
    }, (err) => {
      this.handleError(err);
      this.handleAIRList(this.AIRItems);
    });
  }

  onActionSubmit($event): void {
    this.deleteAIRItem($event['ID']);
  }

  deleteAIRItem(id: string): void {
    let dialogRef: MatDialogRef<MatDialogDeleteConfirmationComponent>;
    const selectedItemConfiguration = this.expansionPanelItemConfigurationList.filter(item => item.ID === id) [0];
    dialogRef = this.matDialog.open(MatDialogDeleteConfirmationComponent, {
      width: '50rem',
      data: {
        title: 'Are you sure you want to delete AIR Issue?',
        targetId: id,
        notification: 'no-warning'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && this.changeRequestFormGroup.get('id') && this.changeRequestFormGroup.get('id').value) {
        selectedItemConfiguration['isBusy'] = true;
        this.changeRequestService.unlinkAIR$(result, this.changeRequestFormGroup.get('id').value).subscribe((response) => {
          if (response) {
            this.itemsList = this.itemsList.filter(item => {
              return item.number !== id;
            });
            this.changeRequestFormGroup.setControl('contexts', this.fb.array(response));
          }
          selectedItemConfiguration['isBusy'] = false;
          this.createItemList();
        }, (err) => {
          this.itemsList = this.itemsList.map(item => {
            if (item.number === id) {
              item.errorInServiceCall = this.changeRequestService.getErrorMessage(err);
            }
            return item;
          });
          selectedItemConfiguration['isBusy'] = false;
          this.createItemList();
        });
      }
    });
  }

  onAddAIRItem(from?: string) {
    this.importAirDialogRef = this.matDialog.open(ImportAirPbsIssuesDialogComponent, {
      width: '80rem',
      disableClose: true,
      data: {
        'linkedPbsIds': this.PBSItem,
        'linkedAirIds': this.AIRItems,
        'changeRequestID': this.changeRequestFormGroup.get('id').value,
        'trigger': from, // expected values: 'air' - from menu, 'addAIR' - on + icon click
        'pbsLength': this.PBSItem.length
      },
      position: {top: '3rem'} as DialogPosition
    });
    this.importAirDialogRef.afterClosed().subscribe(result => {
      if (result && result.length > 0) {
        if (this.openDialog) {
          window.open('/change-requests/' + this.changeRequestFormGroup.get('id').value, '_self');
        } else {
          this.getAirListOnCRID(this.changeRequestID);
        }
      } else if (result && (result.linkError || result.importError)) {
        this.handleError('');
      }
    });
  }

  openAIRDialog(): void {
    this.onAddAIRItem('air');
  }

  ngOnDestroy(): void {
    this.unsubscribeDeleteActions(this.airDeleteButtonSubscriptions);
  }
}
