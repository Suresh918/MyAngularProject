import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'mc-expansion-panel',
  templateUrl: './mc-expansion-panel.component.html',
  styleUrls: ['./mc-expansion-panel.component.scss']
})
export class MCExpansionPanelComponent implements OnInit {
  @Input()
  header: string;
  @Input()
  isExpanded: boolean;
  @Input()
  headerCost?: string;
  @Input()
  headerHelp?: Info | string;
  @Input()
  buttonLabel?: string;
  @Input()
  showButton?: boolean;
  @Input()
  hideHeaderHelp?: boolean;
  @Input()
  isDataLoading: boolean;
  @Input()
  headerCaption: string;
  @Input()
  expansionDisabled: boolean;
  @Output()
  readonly headerButtonClicked: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  buttonClick() {
    this.headerButtonClicked.emit();
  }
}
