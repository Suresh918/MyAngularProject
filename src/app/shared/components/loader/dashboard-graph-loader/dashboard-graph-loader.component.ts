import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'mc-dashboard-graph-loader',
  templateUrl: './dashboard-graph-loader.component.html',
  styleUrls: ['./dashboard-graph-loader.component.scss']
})
export class DashboardGraphLoaderComponent implements OnInit {
  @Input()
  type: string;
  constructor() {
  }

  ngOnInit(): void {
  }

}
