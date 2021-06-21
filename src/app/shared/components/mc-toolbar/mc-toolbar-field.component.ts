import {Component, Input, OnInit} from '@angular/core';
import {ChangeRequest} from '../../models/mc.model';
import {FormControlConfiguration} from '../../models/mc-configuration.model';
import {McStatesModel} from '../../models/mc-states-model';
import {showFullMenu} from '../../../store';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {Store} from '@ngrx/store';
import {MyChangeState} from '../../models/mc-store.model';

@Component({
  template: ''
})
export class MCToolbarFieldComponent implements OnInit {
  @Input()
  viewState: string;
  @Input()
  changeRequestData: ChangeRequest;
  expandCollapseControlConfiguration: FormControlConfiguration;
  standardFontSize: string;
  fontSize: string;
  mcState: McStatesModel;
  isExpanded: boolean;

  constructor(public readonly userProfileService: UserProfileService,
              public readonly appStore: Store<MyChangeState>) {
  }

  ngOnInit(): void {
    this.mcState = this.userProfileService.getStatesData();
    this.setPreviousStoredStates();
    this.standardFontSize = 'small';
    this.isExpanded = true;
  }

  setPreviousStoredStates() {
    this.mcState = this.userProfileService.getStatesData();
    /*this.fontSize = this.mcState.changeRequestState.detailsPageState.fontSize || this.standardFontSize;
    this.viewState = this.mcState.changeRequestState.detailsPageState.viewState || 'expanded';*/
    this.isExpanded = this.viewState === 'expanded';
  }

  onLayoutChange(selectedState) {
    this.viewState = selectedState;
    /*this.mcState.changeRequestState.detailsPageState.viewState = selectedState;
    this.userProfileService.updateUserProfileStates(this.mcState);*/
    this.isExpanded = this.viewState === 'expanded';
  }

  fontSizeChanged(size) {
    this.fontSize = size;
    this.mcState.changeRequestState.detailsPageState.fontSize = size;
    if (size !== this.standardFontSize) {
      this.appStore.dispatch(showFullMenu(false));
    }
    this.userProfileService.updateUserProfileStates(this.mcState);
  }
}
