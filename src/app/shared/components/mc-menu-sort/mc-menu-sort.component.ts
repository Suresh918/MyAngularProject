import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {McSortingConfiguration} from '../../../core/utilities/mc-sorting-configuration.service';
import {Sort} from '@angular/material/sort';

@Component({
  selector: 'mc-menu-sort',
  templateUrl: './mc-menu-sort.component.html',
  styleUrls: ['./mc-menu-sort.component.scss']
})
export class MCMenuSortComponent  {
  @Input()
  sortConfiguration: McSortingConfiguration;
  @Input()
  initialSort: Sort;
  @Input()
  disableSortClear: boolean;
  @Input()
  sortFromLinkedItem: boolean;
  @Input()
  listType: string;
  @Output()
  readonly sortChange: EventEmitter<Sort> = new EventEmitter<Sort>();


  constructor() {
  }

  triggerOverviewListSortChange(event) {
    this.sortChange.emit(event);
  }

}
