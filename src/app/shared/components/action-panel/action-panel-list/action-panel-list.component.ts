import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HelpersService} from '../../../../core/utilities/helpers.service';
import {ServiceParametersService} from '../../../../core/services/service-parameters.service';
import {ConfigurationService} from "../../../../core/services/configurations/configuration.service";

@Component({
  selector: 'mc-action-panel-list',
  templateUrl: './action-panel-list.component.html',
  styleUrls: ['./action-panel-list.component.scss']
})
export class ActionPanelListComponent implements OnInit {
  @Input()
  actionOverViewList: any[];
  @Input()
  caseObjectType: string;
  allActionStatus: {};

  constructor(private readonly router: Router,
              private readonly configurationService: ConfigurationService,
              private readonly serviceParametersService: ServiceParametersService) {
    this.getAllStatusByService();
  }

  ngOnInit() {
  }

  openActions(actionID) {
    this.router.navigate([]).then(() => {
      window.open('actions/' + actionID, '_blank');
    });
  }

  isEnDateGreater(actionDeadline): boolean {
    return HelpersService.isPastDate(actionDeadline);
  }

  getEnDateDaysLeft(actionDeadline): number {
    return HelpersService.getDaysLeftFromNow(actionDeadline);
  }

  getActionStatus(status: string) {
    return this.configurationService.getFormFieldOptionDataByValue('Action',
      'generalInformation.status', status, 'label');
  }

  getAllStatusByService() {
    this.allActionStatus = this.configurationService.getFormFieldOptionDataByValue('Action',
      'generalInformation.status', 'options');
  }
}
