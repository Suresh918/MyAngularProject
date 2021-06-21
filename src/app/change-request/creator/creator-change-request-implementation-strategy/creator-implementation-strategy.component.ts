import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';

import {UserProfileService} from '../../../core/services/user-profile.service';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';
import {MCFormGroupService} from '../../../core/utilities/mc-form-group.service';
import {MyChangeState, SidePanelState} from '../../../shared/models/mc-store.model';
import {PageTitleService} from '../../../core/services/page-title.service';
import {ChangeRequestService} from '../../change-request.service';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';
import {ChangeRequestImplementationStrategyCoreComponent} from '../../shared/change-request-implementation-strategy/change-request-implementation-strategy-core.component';


@Component({
  selector: 'mc-creator-implementation-strategy',
  templateUrl: './creator-implementation-strategy.component.html',
  styleUrls: ['./creator-implementation-strategy.component.scss'],
})
export class CreatorImplementationStrategyComponent extends ChangeRequestImplementationStrategyCoreComponent implements OnInit {

  constructor(public readonly userProfileService: UserProfileService,
              public readonly activatedRoute: ActivatedRoute,
              public readonly changeRequestService: ChangeRequestService,
              public readonly mcFormGroupService: MCFormGroupService,
              public readonly appStore: Store<MyChangeState>,
              public readonly configurationService: ConfigurationService,
              public readonly sidePanelStore: Store<SidePanelState>,
              public readonly pageTitleService: PageTitleService) {
    super(userProfileService, activatedRoute, changeRequestService, mcFormGroupService, appStore, configurationService, sidePanelStore, pageTitleService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  toNumber(data: string) {
    return +data;
  }
}
