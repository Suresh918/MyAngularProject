import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';

@Component({
  selector: 'mc-button-overlay-card',
  templateUrl: './mc-button-overlay-card.component.html',
  styleUrls: ['./mc-button-overlay-card.component.scss']
})
export class MCButtonOverlayCardComponent implements OnInit {
  @Input()
  headerIcon: string;
  @Input()
  headerTitle: string;
  @Input()
  buttonType: string;
  @Input()
  buttonText: string;
  @Input()
  tooltip: string;
  @Input()
  caseObject: any;
  @Input()
  overlayData: any;
  @Input()
  progressBar: boolean;
  @Input()
  hideHeaderSection: boolean;
  @Input()
  showCategories: boolean;
  @Input()
  hideSectionDivider: boolean;
  @Input()
  isDragDropAllowed: boolean;
  @Input()
  hasBadge: boolean;
  @Input()
  tabbedListIcon: string;
  @Input()
  badgeData: any;
  @Input()
  referenceBadgeData: any;
  @Input()
  badgeType: string;
  @Input()
  defaultItemIcon: string;
  @Input()
  categoryItemsCount: number;
  @Input()
  fractionCount: number;
  @Input()
  closeOnItemClick: boolean;
  @Input()
  isIconBorder: boolean;
  @Input()
  cardSummaryRefForOverlayCard: TemplateRef<any>;
  @Input()
  emptyStateTemplateRefForOverlayCard: TemplateRef<any>;
  @Input()
  overlayCardLoaderTemplateRef: TemplateRef<any>;
  @Input()
  showFooterBar: boolean;
  @Input()
  footerButtonText: string;
  @Input()
  footerButtonColor: string;
  @Input()
  emptyStateData;
  @Input()
  largeAmountsTemplateRef: TemplateRef<any>;
  @Input()
  largeAmountsLength: number;
  @Output() readonly panelOpened: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly listItemClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly reOrderedItems: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly footerButtonClick: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
  }

  ngOnInit() {
  }

  openPanelcard() {
    this.panelOpened.emit();
  }

  onOverLayCardListItemClick($event) {
    this.listItemClicked.emit($event);
  }

  dragDropItems($event) {
    this.reOrderedItems.emit($event);
  }
  onFooterButtonClick() {
    this.footerButtonClick.emit();
  }
}
