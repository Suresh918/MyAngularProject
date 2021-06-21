import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'mc-overview-configurable-card',
  templateUrl: './mc-overview-configurable-card.component.html',
  styleUrls: ['./mc-overview-configurable-card.component.scss']
})
export class MCOverviewConfigurableCardComponent implements OnInit {
  @Output()
  readonly overviewCardClicked: EventEmitter<boolean> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  cardClick() {
    this.overviewCardClicked.emit();
  }

}
