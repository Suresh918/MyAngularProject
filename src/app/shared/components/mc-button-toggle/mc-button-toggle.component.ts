import {Component, Input, OnInit} from '@angular/core';
import {MCFieldComponent} from '../mc-field/mc-field.component';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'mc-button-toggle',
  templateUrl: './mc-button-toggle.component.html',
  styleUrls: ['./mc-button-toggle.component.scss']
})
export class MCButtonToggleComponent extends MCFieldComponent implements OnInit {
  toggleControl: FormControl;

  @Input()
  set selectFormControl(frmControl: FormControl) {
    this.toggleControl = frmControl;
    if (frmControl && (frmControl.value || typeof frmControl.value === 'boolean')) {
      this.toggleControl.setValue(frmControl.value.toString());
    }
  }
  ngOnInit() {
    super.ngOnInit();
  }

}
