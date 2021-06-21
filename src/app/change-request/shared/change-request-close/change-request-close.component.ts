import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

import {CaseObject, ChangeNotice, ChangeRequest} from '../../../shared/models/mc.model';
import {CaseObjectLabel, CaseObjectRouterPath} from '../../../shared/components/case-object-list/case-object.enum';
import {MCAddCbMeetingDialogComponent} from '../../../shared/components/mc-add-cb-meeting-dialog/mc-add-cb-meeting-dialog.component';
import {CaseObjectOverview} from '../../../shared/components/case-object-list/case-object-list.model';
import {ChangeRequestFormConfiguration} from '../../../shared/models/mc-configuration.model';
import {HelpersService} from '../../../core/utilities/helpers.service';

@Component({
  selector: 'mc-change-request-close',
  templateUrl: './change-request-close.component.html',
  styleUrls: ['./change-request-close.component.scss'],
})

export class ChangeRequestCloseComponent implements OnInit, OnChanges {
  @Input()
  changeRequestFormGroup: FormGroup;
  @Input()
  changeRequestConfiguration: ChangeRequestFormConfiguration;
  @Input()
  linkedChangeNotice: CaseObjectOverview;
  @Input()
  isExpanded: boolean;
  @Input()
  isDataLoading: boolean;
  @Input()
  fontChangeTemplate: TemplateRef<any>;
  @Input()
  isLinkedCNLoading: boolean;
  @Input()
  caseObject: CaseObject;

  filterQuery: string;
  caseObjectLabel: string;
  caseObjectType: string;
  caseObjectRouterPath: string;
  disableCommunicateButton: boolean;
  communicateButtonTooltip: string;
  configuration: ChangeRequestFormConfiguration;
  @Output()
  private readonly changeNoticeUnLinkEvent: EventEmitter<ChangeRequest> = new EventEmitter();
  @Output()
  private readonly getButtonState: EventEmitter<void> = new EventEmitter<void>();

  constructor(private readonly helpersService: HelpersService,
              private readonly matDialog: MatDialog) {
  }

  @Input()
  set decisionStatuses(data) {
    if (data && data['closureDiscussion']) {
      this.setCloseCommunicateButtonState(data['closureDiscussion'], data['closureDiscussionDetails']);
    }
  }

  ngOnInit() {
    this.caseObjectType = 'ChangeNotice';
    this.caseObjectLabel = CaseObjectLabel[this.caseObjectType];
    this.caseObjectRouterPath = CaseObjectRouterPath[this.caseObjectType];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.changeRequestFormGroup && changes.changeRequestFormGroup.currentValue && changes.changeRequestFormGroup.currentValue.get('change_owner_type') && changes.changeRequestFormGroup.currentValue.get('change_owner_type').value) {
      this.configuration = JSON.parse(JSON.stringify(this.changeRequestConfiguration));
      const placeholder = this.helpersService.convertToSentenceCase(this.changeRequestFormGroup.get('change_owner_type').value);
      this.configuration.change_owner_type.help['help'].message = this.configuration.change_owner_type.help['help'].message.split('$CHANGE-OWNER-TYPE').join(placeholder);
    }
  }

  setCloseCommunicateButtonState(status?: string, details?: string) {
    switch (status) {
      case 'CLOSED-NOT-COMMUNICATED':
        this.disableCommunicateButton = false;
        this.communicateButtonTooltip = 'Add This CR To CB Meeting';
        break;
      case 'CLOSED-COMMUNICATION-PLANNED':
        this.disableCommunicateButton = true;
        this.communicateButtonTooltip = details ? details : '';
        break;
      case 'CLOSED-COMMUNICATED':
        this.disableCommunicateButton = true;
        this.communicateButtonTooltip = details ? details : '';
        break;
      case 'CLOSED-NOT-POSSIBLE':
        this.disableCommunicateButton = true;
        this.communicateButtonTooltip = details ? details : '';
        break;
      default:
        this.disableCommunicateButton = true;
        this.communicateButtonTooltip = 'Not Possible to Communicate';
        break;
    }
  }

  onCommunicateCR() {
    let dialogRef: MatDialogRef<MCAddCbMeetingDialogComponent>;
    dialogRef = this.matDialog.open(MCAddCbMeetingDialogComponent, {
      width: '90rem',
      data: {
        'changeRequestId': this.changeRequestFormGroup.get('id').value,
        'changeRequestDetails': this.changeRequestFormGroup.value,
        'type': 'Closed'
      },
      panelClass: 'add-cb-meeting-dialog'
    });
    dialogRef.afterClosed().subscribe(() => {
     this.getButtonState.emit();
    });
  }
}


