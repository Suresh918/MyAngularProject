import {Component, Input} from '@angular/core';
import {AbstractControl, FormControl} from '@angular/forms';
import {FormControlConfiguration} from '../../models/mc-configuration.model';

@Component({
  selector: 'mc-mat-input-text',
  templateUrl: './mat-input-text.component.html',
  styleUrls: [ './mat-input-text.component.scss' ]
})
export class MatInputTextComponent {
  @Input()
  control: FormControl;
  @Input()
  controlConfiguration: FormControlConfiguration;
  @Input()
  type: string;

  constructor() {
  }

  hasValidator(): boolean {
    if (this.control && this.control.validator && this.control.validator({} as AbstractControl)) {
      return this.control.validator({} as AbstractControl).hasOwnProperty('required');
    } else {
      return false;
    }
  }

}
