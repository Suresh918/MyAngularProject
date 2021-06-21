import {Component, Input, OnInit} from '@angular/core';
import {MCButtonComponent} from '../mc-button/mc-button.component';

@Component({
  selector: 'mc-button-icon-outlined',
  templateUrl: './mc-button-icon-outlined.component.html',
  styleUrls: ['./mc-button-icon-outlined.component.scss']
})
export class MCButtonIconOutlinedComponent extends MCButtonComponent implements OnInit {
  @Input()
  icon: string;
}
