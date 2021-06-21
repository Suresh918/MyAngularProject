import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'mc-list-item',
  templateUrl: './mc-list-item.component.html',
  styleUrls: ['./mc-list-item.component.scss']
})
export class MCListItemComponent implements OnInit {
  @Input()
  id: string;
  @Input()
  title: string;
  @Input()
  mainDescription: string;
  @Input()
  subDescription: string;
  @Input()
  actionButtonText: string;
  @Input()
  actionButtonIcon: string;
  @Input()
  actionButtonTooltip: string;
  @Input()
  showActionButton: string;
  @Input()
  actionButtonType: string;
  @Input()
  action: string;
  @Input()
  icon: string;
  @Input()
  imageUrl: string;
  @Input()
  showActionButtonOnFocus: boolean;
  @Output()
  readonly actionPress: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }
  onActionSubmit(event) {
    this.actionPress.emit(event);
  }
}
