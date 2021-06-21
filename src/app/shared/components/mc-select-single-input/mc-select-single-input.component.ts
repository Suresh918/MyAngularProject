import {Component, Input} from '@angular/core';
import {MCFieldCompositeComponent} from '../mc-field-composite/mc-field-composite.component';

@Component({
  selector: 'mc-select-single-input',
  templateUrl: './mc-select-single-input.component.html',
  styleUrls: ['./mc-select-single-input.component.scss']
})
export class MCSelectSingleInputComponent extends MCFieldCompositeComponent {
@Input()
optionLabelField: string;
@Input()
optionValueField: string;
}
