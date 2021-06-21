import {Component, Input, OnInit} from '@angular/core';
import {ConfigurationService} from '../../../../../core/services/configurations/configuration.service';

@Component({
  selector: 'mc-project-air-pbs-issues-list',
  templateUrl: './project-air-pbs-issues-list.component.html',
  styleUrls: ['./project-air-pbs-issues-list.component.scss']
})
export class ProjectAirPbsIssuesListComponent implements OnInit {
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
