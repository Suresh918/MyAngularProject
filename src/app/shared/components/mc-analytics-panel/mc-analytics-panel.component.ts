import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'mc-analytics-panel',
  templateUrl: './mc-analytics-panel.component.html',
  styleUrls: ['./mc-analytics-panel.component.scss']
})
export class MCAnalyticsPanelComponent implements OnInit {
  @Input()
  cardCountKey?: string;
  @Input()
  cardLabelKey?: string;
  @Input()
  toolTipKey?: string;
  @Input()
  panelData?: any;
  @Input()
  additionalTemplateRef?: any;
  @Input()
  mode?: string;
  @Input()
  panelExpanded?: string;
  @Output() readonly panelSelected: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  panelClicked(event) {
    this.panelSelected.emit(event);
  }
}
