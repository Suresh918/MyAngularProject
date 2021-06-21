import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ChangeRequest} from '../../../models/mc.model';
import {FormControl, FormGroup} from '@angular/forms';
import {
  ChangeNoticeFormConfiguration,
  ChangeRequestFormConfiguration,
  FormControlConfiguration
} from '../../../models/mc-configuration.model';
import {McStatesModel} from '../../../models/mc-states-model';
import {UserProfileService} from '../../../../core/services/user-profile.service';
import {HelpersService} from "../../../../core/utilities/helpers.service";

@Component({
  selector: 'mc-toolbar',
  templateUrl: './mc-toolbar.component.html',
  styleUrls: ['./mc-toolbar.component.scss']
})
export class MCToolbarComponent implements OnInit, OnChanges {
  @Input()
  fontSize: string;
  @Output()
  readonly onChangeFont: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly onLayoutChange: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly editCaseObject: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly onSwitchOwnerClick: EventEmitter<string> = new EventEmitter<string>();
  @Input()
  viewState: string;
  @Input()
  changeRequestData: ChangeRequest;
  @Input()
  caseObjectFormGroup: FormGroup;
  @Input()
  caseObjectConfiguration: ChangeRequestFormConfiguration | ChangeNoticeFormConfiguration;
  @Input()
  showSwitchOwner: boolean;
  @Input()
  snakeCaseNotRequired: boolean;
  configuration: ChangeRequestFormConfiguration | ChangeNoticeFormConfiguration;
  expandCollapseControl: FormControl;
  expandCollapseControlConfiguration: FormControlConfiguration;
  mcState: McStatesModel;

  constructor(private readonly userProfileService: UserProfileService, private readonly helpersService: HelpersService) {
    this.expandCollapseControlConfiguration = {
      'placeholder': '',
      'options': [{
        'value': 'collapsed',
        'label': 'Collapsed',
        'help' : 'Collapse in All Tabs'
      }, {
        'value': 'expanded',
        'label': 'Expanded',
        'help': 'Expand in All Tabs'
      }]
    } as any;
    this.mcState = this.userProfileService.getStatesData();
  }

  onChangeExpandState() {
    this.onLayoutChange.emit(this.expandCollapseControl.value);
  }

  fontSizeChanged(value) {
    this.onChangeFont.emit(value);
  }

  ngOnInit() {
    if (!this.viewState) {
      this.viewState = this.mcState.changeRequestState.imsPageState.viewState || 'expanded';
    }
    this.expandCollapseControl = new FormControl(this.viewState || 'expanded');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.caseObjectFormGroup && changes.caseObjectFormGroup.currentValue && (changes.caseObjectFormGroup.currentValue.get('change_owner_type') && changes.caseObjectFormGroup.currentValue.get('change_owner_type').value || changes.caseObjectFormGroup.currentValue.get('changeOwnerType') && changes.caseObjectFormGroup.currentValue.get('changeOwnerType').value)) {
      this.configuration = JSON.parse(JSON.stringify(this.caseObjectConfiguration));
      if (this.snakeCaseNotRequired) {
        const placeholder = this.helpersService.convertToSentenceCase(this.caseObjectFormGroup.get('changeOwnerType').value);
        // this.configuration['changeOwnerType'].help.help.message = this.configuration['changeOwnerType'].help.help.message.split('$CHANGE-OWNER-TYPE').join(placeholder);
      } else {
        const placeholder = this.helpersService.convertToSentenceCase(this.caseObjectFormGroup.get('change_owner_type').value);
        // this.configuration['change_owner_type'].help.help.message = this.configuration['change_owner_type'].help.help.message.split('$CHANGE-OWNER-TYPE').join(placeholder);
      }
    }
  }

  onEditClick() {
    this.editCaseObject.emit();
  }
}
