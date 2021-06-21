import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'mc-project-mat-items-list-card',
  templateUrl: './project-mat-items-list-card.component.html',
  styleUrls: ['./project-mat-items-list-card.component.scss']
})
export class ProjectMatItemsListCardComponent implements OnInit {
  @Input()
  buttonText: string;
  @Input()
  title: string;
  @Input()
  listItems: any[];
  @Input()
  type: string;
  @Input()
  showLoader: boolean;
  @Output()
  readonly onSelectItem: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {

  }

  onSelectMenuItem(item) {
    this.onSelectItem.emit(item);
  }


}
