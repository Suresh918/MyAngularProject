import {Component, Input} from '@angular/core';
import {MCFieldComponent} from '../mc-field/mc-field.component';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'mc-select-multiple',
  templateUrl: './mc-select-multiple.component.html',
  styleUrls: ['./mc-select-multiple.component.scss']
})
export class MCSelectMultipleComponent extends MCFieldComponent {
  selectControl: FormControl;
  @Input()
  showSection?: boolean;
  @Input()
  sectionTag?: string;
  @Input()
  valueAsLabel?: boolean;
  @Input()
  primaryKeyInValue: string;
  @Input()
  set selectFormControl(frmcontrol: FormControl) {
    this.selectControl = frmcontrol;
    if (frmcontrol && frmcontrol.value && typeof frmcontrol.value === 'number') {
      this.selectControl.setValue(frmcontrol.value.toString());
    }
  }
  @Input()
  disabledOptionsList?: string[];
}
