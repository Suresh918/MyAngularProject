import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {forkJoin, Subscription} from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { MyChangeState, NavBarPayload, SidePanelState } from '../../../shared/models/mc-store.model';
import { UserProfileService } from '../../../core/services/user-profile.service';
import { McStatesModel } from '../../../shared/models/mc-states-model';
import { selectRightNavBarState, setRightPanelFormDirty, setRightSideNavBar } from '../../../side-panel/store';
import { CaseObjectLinkedItemsCount } from '../../../shared/models/mc-presentation.model';
import { CaseObjectListService } from '../../../core/services/case-object-list.service';
import { CaseObjectRouterPath } from '../../../shared/components/case-object-list/case-object.enum';
import {selectRefreshLinkedItemsCount, setCaseObjectLayout} from '../../../store';
import { MatDialogNavigationConfirmationComponent } from '../../../shared/components/mat-dialog-navigation-confirmation/mat-dialog-navigation-confirmation.component';
import {ChangeRequestService} from '../../../change-request/change-request.service';
import {ReleasePackageDetailsService} from '../../../release-package/release-package-details/release-package-details.service';

@Component({
  selector: 'mc-side-panel-right-menu',
  templateUrl: './side-panel-right-menu.component.html',
  styleUrls: ['./side-panel-right-menu.component.scss'],
  providers: [ChangeRequestService, ReleasePackageDetailsService]
})
export class SidePanelRightMenuComponent implements OnInit, OnDestroy {
  @Input()
  caseObjectType: string;
  @Input()
  isLinkedToCR: boolean;
  @Input()
  caseObjectSubType: string;
  @Input()
  agendaItemCategory: string;
  selectedItem: string;
  mcState: McStatesModel;
  caseObjectLinkedItemsCount: CaseObjectLinkedItemsCount;
  isRightSidePanelFormDirty: boolean;
  private _$navBarSubscriber: Subscription;
  private _$refreshLinkedItemsCountSubscriber: Subscription;

  constructor(private readonly sidePanelStore: Store<SidePanelState>,
    private readonly userProfileService: UserProfileService,
    private readonly caseObjectListService: CaseObjectListService,
    private  readonly  changeRequestService: ChangeRequestService,
    private readonly releasePackageDetailsService: ReleasePackageDetailsService,
    private readonly appStore: Store<MyChangeState>,
    public dialog: MatDialog) {
  }

  private _caseObjectId: string;
  private _secondaryCaseObjectId: string;

  @Input()
  set caseObjectId(caseObjectId: string) {
    if (caseObjectId) {
      this._caseObjectId = caseObjectId;
      this.getCaseObjectLinkedItemsCount();
    }
  }

  @Input()
  set secondaryCaseObjectID(id: string) {
    if (id) {
      this._secondaryCaseObjectId = id;
      if (this._secondaryCaseObjectId && this._caseObjectId) {
        this.getCaseObjectLinkedItemsCount();
      }
    }
  }

  ngOnInit() {
    this.subscribeToNavBarChanges();
  }

  subscribeToNavBarChanges(): void {
    this._$navBarSubscriber = this.sidePanelStore.pipe(select(selectRightNavBarState)).subscribe((res: NavBarPayload) => {
      if (res && res.isOpen) {
        this.selectedItem = res.panelMode;
      } else {
        this.selectedItem = '';
      }
      if (res && res.hasOwnProperty('isPanelFormDirty')) {
        this.isRightSidePanelFormDirty = res.isPanelFormDirty.valueOf();
      }
    });
    this._$refreshLinkedItemsCountSubscriber = this.appStore.pipe(select(selectRefreshLinkedItemsCount)).subscribe((res: Boolean) => {
      if (res && res.valueOf()) {
        this.getCaseObjectLinkedItemsCount();
      }
    });
  }

  getCaseObjectLinkedItemsCount(): void {
    if (this.caseObjectType && this._caseObjectId && this.caseObjectType !== 'Review') {
      if (this.caseObjectType === 'ChangeRequest') {
        const serviceList = [this.changeRequestService.getCRCollaborationObjectCount(this._caseObjectId), this.changeRequestService.getCRLinkedItemsCount(this._caseObjectId)];
        forkJoin(serviceList).subscribe(resList => {
          if (resList && resList.length > 1) {
            this.caseObjectLinkedItemsCount = this.processLinkedItemsCountResponse(resList[0], resList[1]);
          }
        });
      } else if (this.caseObjectType === 'ReleasePackage') {
        this.releasePackageDetailsService.getRPLinkedItemsCount(this._caseObjectId).subscribe(linkedObjectCounts => {
          this.caseObjectLinkedItemsCount = this.processLinkedItemsCountResponse(linkedObjectCounts);
        });
      } else if (this.caseObjectType === 'AgendaItem' && this._secondaryCaseObjectId) {
        if (!this.isLinkedToCR) {
          this.caseObjectListService.getCaseObjectLinkedItemsCount(CaseObjectRouterPath[this.caseObjectType], this._caseObjectId).subscribe(resList => {
            if (resList) {
              this.caseObjectLinkedItemsCount = resList;
            }
          });
        } else {
          const serviceList = [this.changeRequestService.getCRCollaborationObjectCount(this._secondaryCaseObjectId),
            this.caseObjectListService.getCaseObjectLinkedItemsCount(CaseObjectRouterPath[this.caseObjectType], this._caseObjectId)];
          forkJoin(serviceList).subscribe(resList => {
            if (resList && resList.length > 1) {
              this.caseObjectLinkedItemsCount = this.processLinkedItemsCountResponse(resList[0], resList[1]);
            }
          });
        }
      } else {
        this.caseObjectListService.getCaseObjectLinkedItemsCount(CaseObjectRouterPath[this.caseObjectType], this._caseObjectId).subscribe(linkedObjectCounts => {
          this.caseObjectLinkedItemsCount = linkedObjectCounts;
        });
      }
    }
  }

  processLinkedItemsCountResponse(CommentsResponse, CBCommentsResponse?) {
    if (CommentsResponse && CBCommentsResponse) {
      return {
        openActionsCount:  (this.caseObjectType === 'ChangeRequest')  ? CommentsResponse['open_actions_count']  : ((this.agendaItemCategory !== 'ccb') ? CBCommentsResponse['openActionsCount'] : CommentsResponse['open_actions_count'] + CBCommentsResponse['openActionsCount']),
        totalActionsCount: CommentsResponse['all_actions_count'] + CBCommentsResponse['totalActionsCount'],
        notesCount: CommentsResponse['comments_count'] + CBCommentsResponse['notesCount'],
        attachmentsCount: CommentsResponse['all_attachments_count'] + CBCommentsResponse['attachmentsCount'],
        otherAttachmentsCount: CommentsResponse['documents_count'] + CBCommentsResponse['otherAttachmentsCount']
      } as CaseObjectLinkedItemsCount;
    } else if (CommentsResponse) {
      return {
        openActionsCount: CommentsResponse['open_actions_count'],
        totalActionsCount: CommentsResponse['all_actions_count'],
        notesCount: CommentsResponse['comments_count'],
        attachmentsCount: CommentsResponse['all_attachments_count'],
        otherAttachmentsCount: CommentsResponse['documents_count']
      } as CaseObjectLinkedItemsCount;
    }
    return {
      openActionsCount: 0,
      totalActionsCount: 0,
      notesCount: 0,
      attachmentsCount: 0,
      otherAttachmentsCount: 0
    };
  }

  click(actionType: string): void {
    if (this.isRightSidePanelFormDirty && this.caseObjectType !== 'Review') {
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
          this.triggerMenuTabChange(actionType);
        }
      });
    } else {
      this.triggerMenuTabChange(actionType);
    }
  }

  triggerMenuTabChange(actionType: string): void {
    this.mcState = this.userProfileService.getStatesData();
    let isRightPanelMode;
    if (this.mcState.navBarState.caseObjectNavBarState.length !== 0 && this.mcState.navBarState.caseObjectNavBarState.find((item) => item.caseObjectType === this.caseObjectType)) {
      const value = this.mcState.navBarState.caseObjectNavBarState.find((item) => item.caseObjectType === this.caseObjectType);
      if (value && value.isRightPanelOpen && value.rightPanelMode === actionType) {
        this.sidePanelStore.dispatch(setRightSideNavBar(false, ''));
        this.selectedItem = '';
        isRightPanelMode = false;
      } else {
        this.selectedItem = actionType;
        isRightPanelMode = true;
        this.sidePanelStore.dispatch(setRightSideNavBar(true, actionType));
      }
      this.mcState.navBarState.caseObjectNavBarState.find(item => item.caseObjectType === this.caseObjectType).rightPanelMode = actionType;
      this.mcState.navBarState.caseObjectNavBarState.find(item => item.caseObjectType === this.caseObjectType).isRightPanelOpen = isRightPanelMode;
    } else {
      this.selectedItem = actionType;
      this.mcState.navBarState.caseObjectNavBarState.push({
        'isLeftPanelOpen': this.mcState.navBarState.isLeftPanelOpen,
      'isRightPanelOpen': !this.mcState.navBarState.isRightPanelOpen,
      'leftPanelMode': this.mcState.navBarState.leftPanelMode,
      'rightPanelMode': actionType,
      'caseObjectType': this.caseObjectType
      });
      this.sidePanelStore.dispatch(setRightSideNavBar(true, actionType));
    }
    this.appStore.dispatch(setCaseObjectLayout({
      showActionsPanel: false
    }));
    this.userProfileService.updateUserProfileStates(this.mcState);
  }

  formatCount(count: number): string | number {
    if (count > 999) {
      return '999+';
    }
    return count;
  }

  ngOnDestroy() {
    if (this._$navBarSubscriber) {
      this._$navBarSubscriber.unsubscribe();
    }
    if (this._$refreshLinkedItemsCountSubscriber) {
      this._$refreshLinkedItemsCountSubscriber.unsubscribe();
    }
  }

}
