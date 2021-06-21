import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {Link} from '../../../shared/models/mc-presentation.model';
import {HelpersService} from '../../../core/utilities/helpers.service';

@Component({
  selector: 'mc-add-items-container',
  templateUrl: './add-items-container.component.html',
  styleUrls: ['./add-items-container.component.scss']
})
export class AddItemsContainerComponent implements OnInit {
  @Input()
  title: string;
  @Input()
  showAddButton: boolean;
  @Input()
  showRemoveButton: boolean;
  @Input()
  itemList: any[];
  @Input()
  noDataMessage: string;
  @Input()
  noDataHeader: string;
  @Input()
  trigger: string;
  @Input()
  sortAscending?: boolean;
  @Input()
  isMultipleSVGIcon: boolean;
  @Input()
  showProgressBar: boolean;
  @Input()
  totalListCount: number;
  @Input()
  defaultIcon?: string;
  @Input()
  caseObjectType: string;
  @Input()
  listItemRef?: TemplateRef<any>;
  @Input()
  removeButtonToolTip: boolean;
  isEnablePAF: boolean;
  @Output() readonly addItemEvent: EventEmitter<any> = new EventEmitter();
  @Output() readonly removeItemEvent: EventEmitter<any> = new EventEmitter();
  @Output() readonly sortChangeEvent: EventEmitter<any> = new EventEmitter();
  @Output() readonly listScrolled: EventEmitter<any> = new EventEmitter();

  constructor(private readonly helpersService: HelpersService) {
  }

  ngOnInit() {
    this.isEnablePAF = window['enablePAF']; // added in index.html
  }

  addItem(item: any, event?: Event) {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
    this.addItemEvent.emit(item);
  }

  removeItem(item: any, event?: Event) {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
    this.removeItemEvent.emit(item);
  }

  sortClicked() {
    this.sortChangeEvent.emit();
  }

  onScroll() {
    this.listScrolled.emit();
  }

  navigateToCaseObject(item: Link): void {
    if (item.type && this.helpersService.getCaseObjectForms(item.type)) {
      const path = this.helpersService.getCaseObjectForms(item.type).path;
      window.open(path + '/' + item.ID, '_blank');
    }
  }
}
