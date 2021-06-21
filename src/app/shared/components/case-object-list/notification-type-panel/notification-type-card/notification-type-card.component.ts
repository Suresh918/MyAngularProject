import {Component, EventEmitter, Input, Output} from '@angular/core';

import {NotificationAnalytics} from '../../case-object-list.model';

@Component({
  selector: 'mc-notification-type-card',
  templateUrl: './notification-type-card.component.html',
  styleUrls: ['./notification-type-card.component.scss']
})
export class NotificationTypeCardComponent {
  @Input()
  cardDetail: NotificationAnalytics;
  @Input()
  expandStatePanel: boolean;
  @Output()
  readonly cardChecked: EventEmitter<any> = new EventEmitter();

  checked() {
    this.cardChecked.emit();
  }
}
