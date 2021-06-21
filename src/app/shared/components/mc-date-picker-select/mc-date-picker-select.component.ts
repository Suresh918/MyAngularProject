import {Component, Input} from '@angular/core';
import {MCFieldComponent} from '../mc-field/mc-field.component';

@Component({
  selector: 'mc-date-picker-select',
  templateUrl: './mc-date-picker-select.component.html',
  styleUrls: ['./mc-date-picker-select.component.scss']
})
export class MCDatePickerSelectComponent extends MCFieldComponent {
  @Input()
  type: string;
}
