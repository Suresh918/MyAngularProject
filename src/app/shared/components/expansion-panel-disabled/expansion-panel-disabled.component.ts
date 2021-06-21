import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'mc-expansion-panel-disabled',
  templateUrl: './expansion-panel-disabled.component.html',
  styleUrls: ['./expansion-panel-disabled.component.scss']
})
export class ExpansionPanelDisabledComponent implements OnInit {
  @Input()
  header: string;
  @Input()
  helpMessage: string;
  @Input()
  showHelpMessage: boolean;
  @Input()
  addButtonTooltip: string;
  @Input()
  showAddButton: boolean;

  constructor() {
  }

  ngOnInit(): void {
  }

}
