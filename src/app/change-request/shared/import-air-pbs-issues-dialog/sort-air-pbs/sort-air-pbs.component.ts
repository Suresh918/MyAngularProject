import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'mc-sort-air-pbs',
  templateUrl: './sort-air-pbs.component.html',
  styleUrls: ['./sort-air-pbs.component.scss']
})
export class SortAirPbsComponent implements OnInit {
  @Input()
  selectedAirPbsItems: any[];
  @Output() readonly selectionChangeEvent: EventEmitter<void> = new EventEmitter<void>();

  dragElementIndex: number;
  showItemsTooltips: boolean;

  constructor() {
    this.showItemsTooltips = true;
  }

  ngOnInit() {
  }

  onDropItem(event?: any): void {
    if (event.index - 1 !== this.dragElementIndex) {
      moveItemInArray(this.selectedAirPbsItems, this.dragElementIndex, event.index - 1);
      this.selectionChangeEvent.emit();
    }
  }

  itemDragStarted(index: number): void {
    this.dragElementIndex = index;
    this.showItemsTooltips = false;
  }

  onItemDragEnd(): void {
    this.showItemsTooltips = true;
  }

  getProblemID(item) {
    if (item && item.itemType && item.itemType.toUpperCase() === 'PBS') {
      return item.projectID;
    } else if (item && item.itemType && item.itemType.toUpperCase() === 'AIR' ) {
      return item.owner.full_name + ' - ' + item.owner.abbreviation;
    } else {
      return '';
    }
  }
  checkForPbs(item) {
    return item.itemType.toUpperCase() === 'PBS';
  }
  checkForAir(item) {
    return item.itemType.toUpperCase() === 'AIR';
  }
}
