import {Component, EventEmitter, Input, Output, TemplateRef, AfterViewInit, ViewChild} from '@angular/core';
import {Sort} from '@angular/material/sort';
import {HelpersService} from '../../../core/utilities/helpers.service';

@Component({
  selector: 'mc-button-overlay-tabbed',
  templateUrl: './mc-button-overlay-tabbed.component.html',
  styleUrls: ['./mc-button-overlay-tabbed.component.scss']
})
export class MCButtonOverlayTabbedComponent implements AfterViewInit {
  @Input()
  badgeColor: string;
  @Input()
  headerIcon: string;
  @Input()
  headerTitle: string;
  @Input()
  buttonText: string;
  @Input()
  buttonType: string;
  @Input()
  tooltip: string;
  @Input()
  caseObject: any;
  @Input()
  overlayData: any;
  @Input()
  progressBar: boolean;
  @Input()
  disableClickOnItem: boolean;
  @Input()
  badgeData?: number;
  @Input()
  badgeType?: string;
  @Input()
  hasBadge: boolean;
  @Input()
  defaultItemIcon: string;
  @Input()
  tabbedListIcon: string;
  @Input()
  overlayMenuYPosition: string;
  @Input()
  closeOnItemClick: boolean;
  @Input()
  panelCloseOnItemClick: boolean;
  @Input()
  selectedTabIndex: number;
  @Input()
  showAllForTabs: any[];
  @Input()
  sortMenuForTabs: any[];
  @Input()
  selectedSortItem: Sort;
  @Input()
  largeAmountsForTabs: any[];
  @Input()
  largeAmountsLength: number;
  @Input()
  isIconBorder: boolean;
  @Input()
  objectAsSnakeCase: boolean;
  @Input()
  largeAmountsRef: TemplateRef<any>;
  @Input()
  emptyStateRef: TemplateRef<any>;
  @Input()
  cardSummaryRef: TemplateRef<any>;
  @Input()
  defaultIconTempRef: TemplateRef<any>;
  @Input()
  menuSortRefr: TemplateRef<any>;
  @Output() readonly panelOpened: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly listItemClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly selectedTab: EventEmitter<string> = new EventEmitter<string>();
  @Output() readonly showAllItems: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('buttonPosition') buttonPositionDiv;
  yPosition: string;

  constructor(private readonly helpersService: HelpersService) {
    this.yPosition = 'below';
  }

  onOverLayTabbedListItemClick($event) {
    this.listItemClicked.emit($event);
  }

  onOverlayTabbedPanelOpen($event) {
    this.panelOpened.emit();
  }

  selectedTabClick($event) {
    this.selectedTab.emit($event);
  }

  showAllItemsClick() {
    this.showAllItems.emit();
  }

  ngAfterViewInit() {
    this.yPosition = this.helpersService.getCardVerticalPosition(this.buttonPositionDiv.nativeElement.offsetTop);
  }
}
