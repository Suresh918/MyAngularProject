import {Component, Input} from '@angular/core';
import {MCFieldCompositeComponent} from '../mc-field-composite/mc-field-composite.component';

@Component({
  selector: 'mc-button-toggle-input',
  templateUrl: './mc-button-toggle-input.component.html',
  styleUrls: ['./mc-button-toggle-input.component.scss']
})
export class MCButtonToggleInputComponent extends MCFieldCompositeComponent {
  @Input()
  showEditableDiv: boolean;
  @Input()
  disabledOptionsList: string[];
  @Input()
  label: string;

}
