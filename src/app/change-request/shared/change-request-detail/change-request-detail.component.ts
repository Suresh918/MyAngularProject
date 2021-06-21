import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {Store} from '@ngrx/store';

import {ChangeRequest} from '../../../shared/models/mc.model';
import {ChangeRequestService} from '../../change-request.service';
import {ChangeRequestDetailsCoreComponent} from './change-request-details-core.component';
import {MyChangeState, ParallelUpdateState, SidePanelState} from '../../../shared/models/mc-store.model';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {ChangeNoticeService} from '../../../change-notice/change-notice.service';
import {UserAuthorizationService} from '../../../core/services/user-authorization.service';
import {MCFormGroupService} from '../../../core/utilities/mc-form-group.service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {CerberusService} from '../../../core/services/cerberus.service';
import {PageTitleService} from '../../../core/services/page-title.service';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';
import {MandatoryFieldTabMappingService} from '../../../core/utilities/mandatory-field-tab-mapping.service';
import {ImpactedItemService} from '../../../core/services/impacted-item.service';
import {CheckItemPipe} from '../../../shared/pipes/check-item.pipe';
import {UserPermissionService} from '../../../core/services/user-permission.service';


@Component({
  selector: 'mc-change-request-detail',
  templateUrl: './change-request-detail.component.html',
  providers: [CheckItemPipe, ChangeNoticeService]
})

export class ChangeRequestDetailComponent extends ChangeRequestDetailsCoreComponent implements OnInit {

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
              public readonly mandatoryFieldTabMappingService: MandatoryFieldTabMappingService,
              public readonly userPermissionService: UserPermissionService,
              public readonly impactedItemService: ImpactedItemService
  ) {
    super(appStore, dialog, userProfileService, changeRequestService, changeNoticeService, userAuthorizationService,
      mcFormGroupService, activatedRoute, helpersService, router, customAlert, cerberusService, sidePanelStore,
      parallelUpdateStore, pageTitleService, storeHelperService, mandatoryFieldTabMappingService, impactedItemService, userPermissionService, configurationService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.initializeChangeRequestDetails();
  }

  updateCRType(changeRequest: ChangeRequest) {
    this.changeRequestResponse = changeRequest;
    this.isCreatorCR = changeRequest.change_owner_type && changeRequest.change_owner_type.toUpperCase() === 'CREATOR';
    this.isProjectCR = changeRequest.change_owner_type && changeRequest.change_owner_type.toUpperCase() === 'PROJECT';
  }
}
