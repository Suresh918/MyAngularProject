import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {merge} from 'rxjs';
import {select, Store} from '@ngrx/store';

import {UserAuthorizationService} from '../../../core/services/user-authorization.service';
import {ChangeRequest} from '../../../shared/models/mc.model';
import {CheckItemPipe} from '../../../shared/pipes/check-item.pipe';
import {ChangeRequestService} from '../../change-request.service';
import {MCFormGroupService} from '../../../core/utilities/mc-form-group.service';
import {CerberusService} from '../../../core/services/cerberus.service';
import {PageTitleService} from '../../../core/services/page-title.service';

import {
  CaseObjectTabStatus,
  MyChangeState,
  ParallelUpdateState,
  SidePanelState
} from '../../../shared/models/mc-store.model';
import {
  selectCaseObjectTabStatus,
  selectShowFullMenu,
} from '../../../store';
import {selectRightNavBarState} from '../../../side-panel/store';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';
import {MandatoryFieldTabMappingService} from '../../../core/utilities/mandatory-field-tab-mapping.service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';
import {ChangeNoticeService} from '../../../change-notice/change-notice.service';
import {ChangeRequestDetailsCoreComponent} from '../../shared/change-request-detail/change-request-details-core.component';
import {ImpactedItemService} from '../../../core/services/impacted-item.service';
import {MatDialog} from '@angular/material/dialog';
import {UserPermissionService} from '../../../core/services/user-permission.service';

@Component({
  selector: 'mc-project-change-request-details',
  templateUrl: './project-change-request-details.component.html',
  styleUrls: ['./project-change-request-details.component.scss'],
  providers: [CheckItemPipe, ChangeNoticeService]
})

export class ProjectChangeRequestDetailsComponent extends ChangeRequestDetailsCoreComponent implements OnInit, OnDestroy {

  constructor(public readonly appStore: Store<MyChangeState>,
              public dialog: MatDialog,
              public readonly userProfileService: UserProfileService,
              public readonly changeRequestService: ChangeRequestService,
              public readonly changeNoticeService: ChangeNoticeService,
              public readonly userAuthorizationService: UserAuthorizationService,
              public readonly mcFormGroupService: MCFormGroupService,
              public readonly activatedRoute: ActivatedRoute,
              public readonly helpersService: HelpersService,
              public readonly router: Router,
              public readonly customAlert: MatSnackBar,
              public readonly cerberusService: CerberusService,
              public readonly sidePanelStore: Store<SidePanelState>,
              public readonly parallelUpdateStore: Store<ParallelUpdateState>,
              public readonly pageTitleService: PageTitleService,
              public readonly configurationService: ConfigurationService,
              public readonly storeHelperService: StoreHelperService,
              public readonly impactedItemService: ImpactedItemService,
              public readonly userPermissionService: UserPermissionService,
              public readonly mandatoryFieldTabMappingService: MandatoryFieldTabMappingService
  ) {
    super(appStore, dialog, userProfileService, changeRequestService, changeNoticeService, userAuthorizationService,
      mcFormGroupService, activatedRoute, helpersService, router, customAlert, cerberusService, sidePanelStore,
      parallelUpdateStore, pageTitleService, storeHelperService, mandatoryFieldTabMappingService, impactedItemService, userPermissionService, configurationService);
  }

  canDeactivate() {
    return !(this.changeRequestFormGroup.dirty || this.isRightSidePanelFormDirty);
  }

  ngOnInit() {
    super.ngOnInit();
    this.subscribeAppStore();
    this.initializeChangeRequest();
    this.getImsTabSelected();
    // this.getLinkedSolutionItems(this.param);
    this.showMenuSubscriptions$ = merge(this.appStore.pipe(select(selectShowFullMenu)),
      this.sidePanelStore.pipe(select(selectRightNavBarState))).subscribe(() => {
      setTimeout(() => {
        if (this.crTabGroup) {
          this.crTabGroup.realignInkBar();
        }
      }, 600);
    });
    // When CaseActions are called or CR Details are updated
    this.crDetailsChange$.subscribe(() => {
      if (this.changeRequestDetails &&
        (this.crCasePermissions === null ||
          (this.crCasePermissions && Object.keys(this.crCasePermissions).length === 0))
      ) {
        this.caseActions = [];
        this.replaceObjectsIfExists(this.changeRequestDetails);
        this.changeRequestFormGroup = this.mcFormGroupService.createChangeRequestFormGroup(new ChangeRequest(this.changeRequestDetails), [], []);
        this.mcFormGroupService.checkAndSetCaseObjectsFieldsEnableState(this.changeRequestFormGroup, this.caseActions, false);
      } else if (this.changeRequestDetails && this.crCasePermissions) {
        this.initializeChangeRequestWithCaseActions();
      }
    });
    // This is when we navigate from other pages like Notifications
    this.caseObjectTabSubscription$ = this.appStore.pipe(select(selectCaseObjectTabStatus)).subscribe(
      (res: CaseObjectTabStatus) => {
        if (res && (res.currentTab || res.currentTab === 0)) {
          this.activeTabSelected = res.currentTab;
        }
      });
  }

  updateCRView(changeRequest: ChangeRequest) {
    this.changeRequestDetails = changeRequest && changeRequest.id ? {...this.changeRequestDetails, ...changeRequest} : this.changeRequestDetails;
    this.updateChangeRequestView.emit(this.changeRequestDetails);
  }
}
