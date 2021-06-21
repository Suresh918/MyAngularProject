import {Component, Input, OnInit} from '@angular/core';
import {HelpersService} from '../../../../core/utilities/helpers.service';

@Component({
  selector: 'mc-action-panel-icon',
  templateUrl: './action-panel-icon.component.html',
  styleUrls: ['./action-panel-icon.component.scss']
})
export class ActionPanelIconComponent implements OnInit {
  @Input()
  caseObjectType: string;
  @Input()
  action: any;

  constructor() {
  }

  ngOnInit() {
  }

  isEnDateGreater(actionDeadline): boolean {
    return HelpersService.isPastDate(actionDeadline);
  }

  getEnDateDaysLeft(actionDeadline): number {
    return HelpersService.getDaysLeftFromNow(actionDeadline);
  }

}
