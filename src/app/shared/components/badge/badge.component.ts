import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'mc-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MCBadgeComponent {
  @Input()
  count: number;
  @Input()
  backgroundColor: string;
  @Input()
  fontColor: string;

  constructor() {
  }

}
