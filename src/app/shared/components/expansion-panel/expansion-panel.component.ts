import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'mc-mat-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.scss']
})
export class ExpansionPanelComponent implements OnInit {
  @Input()
  header: string;
  @Input()
  headerStatus: string;
  @Input()
  isExpanded: boolean;
  @Input()
  headerCost?: string;
  @Input()
  fontSize: string;
  constructor() {
    this.isExpanded = this.isExpanded || true;
  }

  ngOnInit() {
  }

}
