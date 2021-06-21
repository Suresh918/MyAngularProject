import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'mc-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  @Input()
  type: string;
  @Input()
  count: number;
  @Input()
  height: string;
  @Input()
  viewType: string;
  @Input()
  isDashboardWidget: boolean;
  countArray: any[];

  constructor() {
  }

  ngOnInit(): void {
    this.countArray = Array(this.count);
  }

}
