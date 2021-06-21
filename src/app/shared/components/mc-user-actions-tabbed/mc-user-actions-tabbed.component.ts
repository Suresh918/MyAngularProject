import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {Router} from '@angular/router';
import {Categories} from '../../models/mc-presentation.model';

@Component({
  selector: 'mc-user-actions-tabbed',
  templateUrl: './mc-user-actions-tabbed.component.html',
  styleUrls: ['./mc-user-actions-tabbed.component.scss']
})
export class MCUserActionsTabbedComponent implements OnInit {
  @Input()
  userActions: Categories;
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
  selectedTabIndex: number;
  @Input()
  showAllForTabs: any[];
  @Input()
  largeAmountsForTabs: any[];
  @Input()
  largeAmountsLength: number;
  @Input()
  isIconBorder: boolean;
  @Input()
  largeAmountsRef: TemplateRef<any>;
  @Input()
  cardSummaryRef: TemplateRef<any>;
  @Output() readonly panelOpened: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly listItemClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly selectedTab: EventEmitter<string> = new EventEmitter<string>();
  @Output() readonly showAllItems: EventEmitter<void> = new EventEmitter<void>();
  constructor(private readonly router: Router) { }

  ngOnInit() {
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

  // navigateToActions(ID) {
  //   event.stopPropagation();
  //   this.router.navigate([]).then(() => {
  //     window.open('actions/' + ID, '_blank');
  //   });
  // }
}
