import {Component, Input, OnInit} from '@angular/core';
import { MCFieldComponent } from '../mc-field/mc-field.component';

@Component({
  selector: 'mc-input-currency',
  templateUrl: './mc-input-currency.component.html',
  styleUrls: ['./mc-input-currency.component.scss']
})
export class MCInputCurrencyComponent extends MCFieldComponent {
  @Input()
  isNegativeCurrency: boolean;
  onAcceptChanges($event: AcceptedChange) {
    const event = {
      ID: $event.ID,
      value: parseInt($event.value, 10),
      oldValue: $event.oldValue,
    };
    super.onAcceptChanges(event);
  }
}
