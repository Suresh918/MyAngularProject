import {Component, Input, OnInit} from '@angular/core';
import {PbsSearchService} from '../../../../../core/services/pbs-search.service';
import {ChangeRequestService} from '../../../../change-request.service';
import {ServiceParametersService} from '../../../../../core/services/service-parameters.service';
import {ConfigurationService} from '../../../../../core/services/configurations/configuration.service';

@Component({
  selector: 'mc-creator-air-pbs-issues-list',
  templateUrl: './creator-air-pbs-issues-list.component.html',
  styleUrls: ['./creator-air-pbs-issues-list.component.scss']
})
export class CreatorAirPbsIssuesListComponent implements OnInit {
  @Input()
  buttonText: string;
  @Input()
  title: string;
  @Input()
  disableLink: boolean;
  @Input()
  type: string;
  @Input()
  items: any[];
  showLoader: boolean;
  listItems: any[];
  deepLinkURLForAIR: string;
  deepLinkURLForPBS: string;

  constructor(public readonly configurationService: ConfigurationService) {
    this.showLoader = false;
    this.listItems = [];
    this.deepLinkURLForPBS = this.configurationService.getLinkUrl('PBS');
    this.deepLinkURLForAIR = this.configurationService.getLinkUrl('AIR');
  }

  ngOnInit() {

  }

  itemSelected(item, type) {
    if (type === 'air') {
      window.open(this.deepLinkURLForAIR + item.number, '_blank');
    } else if (type === 'pbs') {
      window.open(this.deepLinkURLForPBS + item.ID, '_blank');
    }
  }

  getItems() {
    this.listItems = this.items;
  }
}
