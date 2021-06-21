import {Component, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MCFieldCaseActionComponent} from '../mc-field-case-action/mc-field-case-action.component';

@Component({
  selector: 'mc-select-single-case-action',
  templateUrl: './mc-select-single-case-action.component.html',
  styleUrls: ['./mc-select-single-case-action.component.scss']
})
export class MCSelectSingleCaseActionComponent extends MCFieldCaseActionComponent {
  selectControl: FormControl;
  @Input()
  optionsList: string[];
  @Input()
  isInstanceType: boolean;

  @Input()
  set selectFormControl(frmcontrol: FormControl) {
    this.selectControl = frmcontrol;
    if (typeof frmcontrol.value === 'number' || typeof frmcontrol.value === 'string') {
      this.selectControl.setValue(frmcontrol.value.toString());
    }
  }
}
