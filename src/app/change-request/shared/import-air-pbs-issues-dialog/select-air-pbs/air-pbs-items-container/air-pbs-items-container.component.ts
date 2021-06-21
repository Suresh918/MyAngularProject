import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConfigurationService} from '../../../../../core/services/configurations/configuration.service';

@Component({
  selector: 'mc-air-pbs-items-container',
  templateUrl: './air-pbs-items-container.component.html',
  styleUrls: ['./air-pbs-items-container.component.scss']
})
export class AirPbsItemsContainerComponent implements OnInit {
  @Input()
  title: string;
  @Input()
  showAddButton: boolean;
  @Input()
  showRemoveButton: boolean;
  @Input()
  airPbsItemList: any[];
  @Input()
  noDataMessage: string;
  @Input()
  trigger: string;
  @Input()
  airPbsDividerIndex: number;
  @Input()
  showProgressBar: boolean;
  @Input()
  allowNavigation: boolean = true;

  @Output() readonly addIssueEvent: EventEmitter<any> = new EventEmitter();
  @Output() readonly removeIssueEvent: EventEmitter<any> = new EventEmitter();
  deepLinkURLForAIR: string;
  deepLinkURLForPBS: string;
  constructor(public readonly configurationService: ConfigurationService) {
    this.showAddButton = false;
    this.showRemoveButton = false;
  }

  ngOnInit() {
    this.deepLinkURLForAIR = this.configurationService.getLinkUrl('AIR');
    this.deepLinkURLForPBS = this.configurationService.getLinkUrl('PBS');
  }

  addIssue(airPbsItem: any): void {
    this.addIssueEvent.emit(airPbsItem);
  }

  deleteIssue(airPbsItemIndex: any): void {
    this.removeIssueEvent.emit(airPbsItemIndex);
  }

  getHeader(): string {
    if (this.trigger === 'air') {
      return 'AIR Issues';
    } else if (this.trigger === 'pbs') {
      return 'PBS Issues';
    } else {
      return 'AIR/PBS Issues';
    }
  }

  navigateToIssue(item) {
    if (this.allowNavigation) {
      if (item.itemType === 'AIR') {
        window.open(this.deepLinkURLForAIR + item.number, '_blank', '', false);
      } else {
        window.open(this.deepLinkURLForPBS + item.ID, '_blank', '', false);
      }
    }
  }
}
