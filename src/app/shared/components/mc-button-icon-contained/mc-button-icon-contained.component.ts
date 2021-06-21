import {Component, Input, OnInit} from '@angular/core';
import {MCButtonComponent} from '../mc-button/mc-button.component';

@Component({
  selector: 'mc-button-icon-contained',
  templateUrl: './mc-button-icon-contained.component.html',
  styleUrls: ['./mc-button-icon-contained.component.scss']
})
export class MCButtonIconContainedComponent extends MCButtonComponent implements OnInit {
  @Input()
  icon: string;
  @Input()
  iconSize: string;
  @Input()
  iconTooltip: string;
}
