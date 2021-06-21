import {Component, Input} from '@angular/core';

import {CaseObjectStateAnalytics, NotificationAnalytics} from '../case-object-list.model';

@Component({
  selector: 'mc-notification-type-panel',
  templateUrl: './notification-type-panel.component.html',
  styleUrls: ['./notification-type-panel.component.scss']
})
export class NotificationTypePanelComponent {
  @Input()
  filterQuery: string;
  @Input()
  expandStatePanel: boolean;
  @Input()
  stateCardType: string;
  @Input()
  panelData: NotificationAnalytics[];
  selectedCardIndices: number[];
  cardsList: CaseObjectStateAnalytics[];

  constructor() {
    this.selectedCardIndices = [];
  }

  onStatusCardSelection(cardDetails) {
    cardDetails.checked = !cardDetails.checked;
  }
}
