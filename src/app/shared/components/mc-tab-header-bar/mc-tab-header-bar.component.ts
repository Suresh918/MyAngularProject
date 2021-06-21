import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl} from '@angular/forms';

import {ChangeRequestFormConfiguration, FormControlConfiguration} from '../../../shared/models/mc-configuration.model';
import {McStatesModel} from '../../../shared/models/mc-states-model';
import {UserProfileService} from '../../../core/services/user-profile.service';
import {ChangeRequest} from '../../../shared/models/mc.model';

@Component({
  selector: 'mc-tab-header-bar',
  templateUrl: './mc-tab-header-bar.component.html',
  styleUrls: ['./mc-tab-header-bar.component.scss']
})
export class McTabHeaderBarComponent {
  @Input()
  fontSize: string;
  @Input()
  changeRequestConfiguration: ChangeRequestFormConfiguration;
  @Input()
  changeOwnerControl: FormControl;
  @Output()
  readonly onChangeFont: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly onLayoutChange: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly editCaseObject: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  viewState: string;
  @Input()
  changeRequestData: ChangeRequest;
  @Input()
  selectedTabOnImplementedStrategy: string;
  expandCollapseControl: FormControl;
  expandCollapseControlConfiguration: FormControlConfiguration;
  mcState: McStatesModel;

  constructor(private readonly userProfileService: UserProfileService) {
    this.expandCollapseControlConfiguration = {
      'placeholder': '',
      'options': [{
        'value': 'collapsed',
        'label': 'Collapsed',
        'help': 'Collapse Questions in All Tabs'
      },
        {
          'value': 'expanded',
          'label': 'Expanded',
          'help': 'Expand Questions in All Tabs'
        }]
    } as any;
    this.mcState = this.userProfileService.getStatesData();
    if (!this.viewState) {
      this.viewState = this.mcState.changeRequestState.imsPageState.viewState || 'expanded';
    }
    this.expandCollapseControl = new FormControl(this.viewState || 'expanded');
  }

  onChangeExpandState() {
    this.onLayoutChange.emit(this.expandCollapseControl.value);
  }

  fontSizeChanged(value) {
    this.onChangeFont.emit(value);
  }

  onEditClick(value) {
    this.editCaseObject.emit(value);
  }
}
