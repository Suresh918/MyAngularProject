import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'mc-overlay-loader',
  templateUrl: './overlay-loader.component.html',
  styleUrls: ['./overlay-loader.component.scss']
})
export class OverlayLoaderComponent implements OnInit {
  @Input()
  isDashboardWidget: boolean;
  constructor() { }

  ngOnInit(): void {
  }

}
