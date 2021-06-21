import {Component, Input} from '@angular/core';
import {MCFieldComponent} from '../mc-field/mc-field.component';

@Component({
  selector: 'mc-input-number',
  templateUrl: './mc-input-number.component.html',
  styleUrls: ['./mc-input-number.component.scss']
})
export class MCInputNumberComponent extends MCFieldComponent {
  @Input() prefix: string;
  @Input() suffix: string;
  @Input() fractionDigits: number;
}
