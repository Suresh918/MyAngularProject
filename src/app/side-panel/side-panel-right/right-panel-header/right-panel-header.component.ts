import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Subject, Subscription} from 'rxjs';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';

import {selectRightPanelDirtyState, setRightPanelFormDirty, setRightSideNavBar} from '../../store';
import {MyChangeState, SidePanelState} from '../../../shared/models/mc-store.model';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {MatDialogNavigationConfirmationComponent} from '../../../shared/components/mat-dialog-navigation-confirmation/mat-dialog-navigation-confirmation.component';
import {FilterOptions} from '../../../shared/models/mc-filters.model';
import {filterOptionsUpdate, selectCaseObjectState} from '../../../store';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {CaseObjectData} from '../../../shared/models/mc.model';

@Component({
  selector: 'mc-right-panel-header',
  templateUrl: './right-panel-header.component.html',
  styleUrls: ['./right-panel-header.component.scss']
})
export class RightPanelHeaderComponent implements OnInit, OnDestroy {
  @Input()
  headerText: string;
  @Input()
  itemsCount: number;
  @Input()
  filterQuery: string;
  @Input()
  type: string;
  @Input()
  progressBar: boolean;
  @Input()
  panelMode: string;
  @Output() readonly addItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() readonly closeSidePanel: EventEmitter<any> = new EventEmitter<any>();
  isRightSidePanelFormDirty: boolean;
  sidePanelSubscription$: Subscription;
  caseObjectSubscription$: Subscription;
  caseObjectType: string;
  caseObjectId: string;

  constructor(private readonly sidePanelStore: Store<SidePanelState>,
              private readonly userProfileService: UserProfileService,
              private readonly appStore: Store<MyChangeState>,
              private readonly helpersService: HelpersService,
              public dialog: MatDialog,
              private readonly router: Router) {
  }

  ngOnInit() {
    this.subscribeToSidePanelStore();
    this.subscribeToCaseObject();
  }

  subscribeToSidePanelStore(): void {
    this.sidePanelSubscription$ = this.sidePanelStore.pipe(select(selectRightPanelDirtyState)).subscribe((res: Boolean) => {
      if ((res !== undefined || res !== null)) {
        this.isRightSidePanelFormDirty = res.valueOf();
      }
    });
  }

  subscribeToCaseObject(): void {
    this.caseObjectSubscription$ = this.appStore.pipe(select(selectCaseObjectState)).subscribe((data: CaseObjectData) => {
      if (data.caseObject && (data.caseObject['ID'] || data.caseObject['id']) && data.caseObjectType) {
        this.caseObjectId = data.caseObjectType === 'ReleasePackage' ? data.caseObject['release_package_number'] : data.caseObject['ID'] || data.caseObject['id'];
        this.caseObjectType = data.caseObjectType;
      }
    });
  }

  closePanel() {
    if (this.isRightSidePanelFormDirty && this.type !== 'Review') {
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
          this.triggerClosePanel();
        }
      });
    } else {
      this.triggerClosePanel();
    }
  }

  triggerClosePanel(): void {
    if (this.closeSidePanel) {
      this.closeSidePanel.emit();
    }
    this.sidePanelStore.dispatch(setRightSideNavBar(false, ''));
    const mcState = this.userProfileService.getStatesData();
    if (mcState.navBarState.caseObjectNavBarState.length !== 0 && mcState.navBarState.caseObjectNavBarState.find(item => item.caseObjectType.indexOf(this.type) > -1)) {
      const sidePanelObject = mcState.navBarState.caseObjectNavBarState.find(item => item.caseObjectType.indexOf(this.type) > -1);
      sidePanelObject.rightPanelMode = this.panelMode;
      sidePanelObject.isRightPanelOpen = false;
    }
    this.userProfileService.updateUserProfileStates(mcState);
  }

  openActions() {
      const filters = this.userProfileService.getCaseObjectStateFilters('action');
      if (filters && filters['filtersModel'] && filters['filtersModel']['currentDefaultFilter']) {
        filters['filtersModel']['currentDefaultFilter'] = new FilterOptions({});
        filters['filtersModel']['currentDefaultFilter'].linkedChangeObject = this.helpersService.getCaseObjectForms(this.caseObjectType).filterCaseObject;
        filters['filtersModel']['currentDefaultFilter'].fromCaseObject = this.caseObjectType === 'AgendaItem' ? null : this.helpersService.getCaseObjectForms(this.caseObjectType).filterCaseObject;
        filters['filtersModel']['currentDefaultFilter'].linkedItems = typeof this.caseObjectId === 'number' ? JSON.stringify(this.caseObjectId) : this.caseObjectId;
        const userProfileUpdatedState$: Subject<void> = new Subject();
        this.userProfileService.updateCaseObjectStateFilters('action', filters, userProfileUpdatedState$);
        userProfileUpdatedState$.subscribe(() => {
          if (this.type === 'AgendaItem') {
            let navigationUrl = '/actions/filter/query?filterString=(agendaItem.ID in (' + this.caseObjectId + ')) and (' + this.filterQuery.trim() + ')';
            navigationUrl = navigationUrl.replace(/\r?\n|\r/g, '');
            navigationUrl = navigationUrl.replace(/"/g, '\'');
            window.open(navigationUrl, '_blank');
          } else {
            this.appStore.dispatch(filterOptionsUpdate(true));
            window.open('/actions', '_blank');
          }
        });
    }
  }

  ngOnDestroy() {
    if (this.sidePanelSubscription$) {
      this.sidePanelSubscription$.unsubscribe();
    }
    if (this.caseObjectSubscription$) {
      this.caseObjectSubscription$.unsubscribe();
    }
  }
}
