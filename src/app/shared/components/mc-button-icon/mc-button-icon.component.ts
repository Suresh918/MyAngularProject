import {Component, Input, OnInit} from '@angular/core';
import {MCButtonComponent} from '../mc-button/mc-button.component';

@Component({
  selector: 'mc-button-icon',
  templateUrl: './mc-button-icon.component.html',
  styleUrls: ['./mc-button-icon.component.scss']
})
export class MCButtonIconComponent extends MCButtonComponent implements OnInit {
  @Input()
  icon: string;
  @Input()
  iconSize: string;
  @Input()
  iconTooltip: string;
}
