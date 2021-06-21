import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'mc-chip',
  templateUrl: './mc-chip.component.html',
  styleUrls: ['./mc-chip.component.scss']
})
export class MCChipComponent implements OnInit {
  @Input()
  removable: boolean;
  @Input()
  text: string;
  @Input()
  imageURL: string;
  @Input()
  icon: string;
  @Input()
  disabled: boolean;
  @Input()
  hideTooltip: boolean;
  @Input()
  noCursor = true;
  @Output()
  readonly chipClick: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly remove: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  onRemove(event) {
    this.remove.emit(event);
  }

  onChipClick(event) {
    this.chipClick.emit(event);
  }

}
