import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';

import {ChangeRequestFormConfiguration, ReadOnlyCIAConfiguration} from '../../../shared/models/mc-configuration.model';
import {ChangeRequest} from '../../../shared/models/mc.model';
import {McStatesModel} from '../../../shared/models/mc-states-model';
import {showFullMenu} from '../../../store';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {MCFormGroupService} from '../../../core/utilities/mc-form-group.service';
import {MyChangeState} from '../../../shared/models/mc-store.model';
import {PageTitleService} from '../../../core/services/page-title.service';
import {ChangeRequestService} from '../../change-request.service';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';

@Component({
  selector: 'mc-change-request-cia-core',
  template: ''
})
export class ChangeRequestCIACoreComponent implements OnInit {
  @Input()
  changeRequestFormGroup: FormGroup;
  @Input()
  changeRequestData: ChangeRequest;
  @Input()
  readOnlyCIAData: any;
  changeRequestConfiguration: ChangeRequestFormConfiguration;
  readOnlyCIAConfiguration: ReadOnlyCIAConfiguration;
  crId: string;
  showLoader = true;
  fontSize: string;
  mcState: McStatesModel;
  standardFontSize: string;
  viewState: string;
  showFullScreenButton: boolean;
  isExpanded: boolean;
  isCreatorCR: boolean;
  isProjectCR: boolean;


  constructor(public readonly userProfileService: UserProfileService,
              public readonly activatedRoute: ActivatedRoute,
              public readonly changeRequestService: ChangeRequestService,
              public readonly mcFormGroupService: MCFormGroupService,
              public readonly router: Router,
              public readonly configurationService: ConfigurationService,
              public readonly appStore: Store<MyChangeState>,
              public readonly pageTitleService: PageTitleService) {
    this.standardFontSize = 'small';
    this.isCreatorCR = false;
    this.isProjectCR = false;
    this.showFullScreenButton = true;
    this.readOnlyCIAConfiguration = this.configurationService.getFormFieldParameters('ReadOnlyCIA2.0') as ReadOnlyCIAConfiguration;
    this.changeRequestConfiguration = this.configurationService.getFormFieldParameters('ChangeRequest2.0') as ChangeRequestFormConfiguration;
    this.changeRequestFormGroup = this.mcFormGroupService.createChangeRequestFormGroup(new ChangeRequest({}), []);
    this.activatedRoute.params.subscribe(params => {
      this.crId = params.id;
    });
    this.isExpanded = true;
    this.getPreviousStoredStates();
  }

  ngOnInit() {
  }

  toggleButton() {
    this.showFullScreenButton = !this.showFullScreenButton;
  }

  getPreviousStoredStates() {
    this.mcState = this.userProfileService.getStatesData();
    this.fontSize = this.mcState.changeRequestState.ciaPageState.fontSize || this.standardFontSize;
    this.viewState = this.mcState.changeRequestState.ciaPageState.viewState || 'expanded';
    this.isExpanded = this.viewState === 'expanded';
  }

  onLayoutChange(selectedState) {
    this.viewState = selectedState;
    this.mcState.changeRequestState.ciaPageState.viewState = selectedState;
    this.userProfileService.updateUserProfileStates(this.mcState);
    this.isExpanded = this.viewState === 'expanded';
  }

  fontSizeChanged(size) {
    this.fontSize = size;
    this.mcState.changeRequestState.ciaPageState.fontSize = size;
    if (size !== this.standardFontSize) {
      this.appStore.dispatch(showFullMenu(false));
    }
    this.userProfileService.updateUserProfileStates(this.mcState);
  }

  editCaseObject() {
    this.router.navigate([`/change-requests/${this.changeRequestData.id}`]);
  }

}
