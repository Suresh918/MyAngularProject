import {Component, Input, OnInit} from '@angular/core';
import { MCFieldComponent } from '../mc-field/mc-field.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'mc-select-single',
  templateUrl: './mc-select-single.component.html',
  styleUrls: ['./mc-select-single.component.scss']
})
export class MCSelectSingleComponent extends MCFieldComponent implements OnInit {
  selectControl: FormControl;
  defaultValue: any;
  @Input()
  showSection?: boolean;
  @Input()
  sectionTag?: string;
  @Input() set defaultSelection(data: any) {
    if (data) {
      this.defaultValue = data;
      this.selectControl.setValue(this.defaultValue);
    }
  }

  get defaultSelection() {
    return this.defaultValue;
  }

  @Input()
  set selectFormControl(frmcontrol: FormControl) {
    this.selectControl = frmcontrol;
    if (frmcontrol && typeof frmcontrol.value === 'number') {
      this.selectControl.setValue(frmcontrol.value.toString());
    }
  }

  ngOnInit() {
    if (this.defaultSelection && this.selectControl && this.selectControl.value === '') {
      this.selectControl.setValue(this.defaultSelection);
    }
    super.ngOnInit();
  }
}
