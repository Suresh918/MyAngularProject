import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';

import {UserProfileService} from '../../../core/services/user-profile.service';
import {MCFormGroupService} from '../../../core/utilities/mc-form-group.service';
import {MyChangeState} from '../../../shared/models/mc-store.model';
import {PageTitleService} from '../../../core/services/page-title.service';
import {ChangeRequestService} from '../../change-request.service';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';
import {ChangeRequestCIACoreComponent} from '../../shared/change-request-cia/change-request-cia-core.component';

@Component({
  selector: 'mc-creator-change-request-cia',
  templateUrl: './creator-change-request-cia.component.html',
  styleUrls: ['./creator-change-request-cia.component.scss'],
})
export class CreatorChangeRequestCIAComponent extends ChangeRequestCIACoreComponent implements OnInit {

  constructor(public readonly userProfileService: UserProfileService,
              public readonly activatedRoute: ActivatedRoute,
              public readonly changeRequestService: ChangeRequestService,
              public readonly mcFormGroupService: MCFormGroupService,
              public readonly router: Router,
              public readonly configurationService: ConfigurationService,
              public readonly appStore: Store<MyChangeState>,
              public readonly pageTitleService: PageTitleService) {
    super(userProfileService, activatedRoute, changeRequestService, mcFormGroupService, router, configurationService, appStore, pageTitleService);
  }

  ngOnInit() {
  }

}
