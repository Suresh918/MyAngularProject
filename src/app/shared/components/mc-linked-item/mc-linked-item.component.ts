import {Component, EventEmitter, OnInit, Input, Output, TemplateRef} from '@angular/core';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {Router} from '@angular/router';
import {McSortingConfiguration} from '../../../core/utilities/mc-sorting-configuration.service';
import {Sort} from '@angular/material/sort';
import {ConfigurationService} from "../../../core/services/configurations/configuration.service";

@Component({
  selector: 'mc-linked-item',
  templateUrl: './mc-linked-item.component.html',
  styleUrls: ['./mc-linked-item.component.scss']
})
export class McLinkedItemComponent implements OnInit {
  selectedTabCaseObject: string;
  @Input()
  headerIcon: string;
  @Input()
  headerTitle: string;
  @Input()
  defaultItemIcon: string;
  @Input()
  buttonType: string;
  @Input()
  tooltip: string;
  @Input()
  progressBar: boolean;
  @Input()
  hasBadge: boolean;
  @Input()
  linkedObject: any;
  @Input()
  sortingConfiguration: McSortingConfiguration;
  @Input()
  selectedSortItem: Sort;
  @Input()
  selectedTabIndex: number;
  @Input()
  showAllForTabs: any[];
  @Input()
  sortMenuForTabs: any[];
  @Input()
  isIconBorder: boolean;
  @Input()
  overlayYPosition: string;
  @Input()
  overlayXPosition: string;
  @Input()
  menuSortRef: TemplateRef<any>;
  deepLinkURL: string;
  @Output() readonly panelOpened: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly listItemClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly showAllItems: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly triggerOverviewListSortChangeClick: EventEmitter<Sort> = new EventEmitter<Sort>();
  @Output() readonly selectedTab: EventEmitter<string> = new EventEmitter<string>();

  constructor(private readonly helpersService: HelpersService,
              public readonly configurationService: ConfigurationService,
              private readonly router: Router) {
  }

  ngOnInit() {
  }

  onOverLayTabbedListItemClick($event) {
    this.selectedTabCaseObject = $event.link.type;
    if (this.selectedTabCaseObject === 'AIR' || this.selectedTabCaseObject === 'PBSID') {
      if (this.selectedTabCaseObject === 'PBSID') {
        this.deepLinkURL = this.configurationService.getLinkUrl('PBS');
      } else {
        this.deepLinkURL = this.configurationService.getLinkUrl('AIR');
      }
      window.open(this.deepLinkURL + $event.link.ID, '_blank', '', false);
    } else {
      let path = this.helpersService.getCaseObjectForms(this.selectedTabCaseObject).path;
      if (path === 'agenda-items') {
        path = 'agendas/agenda-items';
      }
      this.router.navigate([]).then(() => {
        window.open(path + '/' + $event.link.ID, '_blank');
      });
    }
  }

  onOverlayTabbedPanelOpen($event) {
    this.panelOpened.emit();
  }

  triggerOverviewListSortChange($event) {
    this.triggerOverviewListSortChangeClick.emit($event);
  }

  selectedTabClick($event) {
    this.selectedTab.emit($event);
  }
  showAllItemsClick() {
    this.showAllItems.emit();
  }
}
