import {Component, Input, OnInit} from '@angular/core';
import { MCFieldComponent } from '../mc-field/mc-field.component';

@Component({
  selector: 'mc-button-radio',
  templateUrl: './mc-button-radio.component.html',
  styleUrls: ['./mc-button-radio.component.scss']
})
export class MCButtonRadioComponent extends MCFieldComponent implements OnInit {
  @Input()
  alignOptionsHorizontally: boolean;
  ngOnInit() {
    super.ngOnInit();
  }

}
