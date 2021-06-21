import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'mc-state-panel-loader',
  templateUrl: './state-panel-loader.component.html',
  styleUrls: ['./state-panel-loader.component.scss']
})
export class StatePanelLoaderComponent implements OnInit {
  @Input()
  height: string;
  @Input()
  viewType: string;
  @Input()
  count: number;
  totalCountArray: number[];
  constructor() {
  }

  ngOnInit(): void {
    this.totalCountArray = Array(this.count).fill(this.count);
  }

}
