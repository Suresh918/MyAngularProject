import {Component, Input, OnInit} from '@angular/core';

import {ReleasePackageStatePanelForm} from '../../../../models/mc-presentation.model';

@Component({
  selector: 'mc-case-object-action-status-card',
  templateUrl: './case-object-action-status-card.component.html',
  styleUrls: ['./case-object-action-status-card.component.scss']
})
export class CaseObjectActionStatusCardComponent {

  @Input()
  showActionsCount: boolean;
  @Input()
  Status: any;
  @Input()
  caseObjectDetails: ReleasePackageStatePanelForm;
  @Input()
  selectedCardIndex: number;
  @Input()
  expandStatePanel: boolean;
  @Input()
  index: number;
  @Input()
  caseObjectType: string;

  constructor() { }

  getActiveStatusCard(actionType, isActive: boolean) {
    if (isActive) {
      switch (actionType) {
        case 'ACCEPTED-AND-LATE':
          return 'action-status--card-active-Accepted-late';
        case 'ACCEPTED-AND-DUE-SOON':
          return 'action-status--card-active-Accepted-due-soon';
        case 'ACCEPTED':
          return 'action-status--card-active-accepted';
        case 'OPEN':
          return 'action-status--card-active-open';
        case 'DETAILS-REQUESTED':
          return 'action-status--card-active-Details-Requested';
        default:
          return '';
      }
    } else {
      switch (actionType) {
        case 'ACCEPTED-AND-LATE':
          return 'action-status--card-Accepted-late';
        case 'ACCEPTED-AND-DUE-SOON':
          return 'action-status--card-Accepted-due-soon';
        case 'ACCEPTED':
          return 'action-status--card-accepted';
        case 'OPEN':
          return 'action-status--card-open';
        case 'DETAILS-REQUESTED':
          return 'action-status--card-Details-Requested';
        default:
          return '';
      }
    }
  }
  getActionsToolTip (actionType) {
    switch (actionType) {
      case 'ACCEPTED-AND-LATE':
        return 'Show \'Late\' only';
      case 'ACCEPTED-AND-DUE-SOON':
        return 'Actions Due In 7 Days';
      case 'ACCEPTED':
        return 'Show \'Accepted\' only (due in 7+ days)';
      case 'OPEN':
        return 'Show \'Open\' only (due in more than 7 days)';
      case 'DETAILS-REQUESTED':
        return 'Actions for which details requested';
      default:
        return '';
    }
  }
}
