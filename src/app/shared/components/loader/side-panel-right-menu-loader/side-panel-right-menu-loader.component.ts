import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'mc-side-panel-right-menu-loader',
  templateUrl: './side-panel-right-menu-loader.component.html',
  styleUrls: ['./side-panel-right-menu-loader.component.scss']
})
export class SidePanelRightMenuLoaderComponent {
  @Input()
  viewType: string;

  constructor() { }


}
