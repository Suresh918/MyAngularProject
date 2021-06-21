import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER } from '@angular/cdk/keycodes';

import { FormControlConfiguration } from 'app/shared/models/mc-configuration.model';

@Component({
  selector: 'mc-mat-input-text-multi-chip',
  templateUrl: './mat-input-text-multi-chip.component.html',
  styleUrls: ['./mat-input-text-multi-chip.component.scss']
})
export class MatInputTextMultiChipComponent implements OnInit {

  @Input()
  control: FormControl;
  @Input()
  controlConfiguration: FormControlConfiguration;
  separatorKeysCodes: number[] = [ENTER];
  addOnBlur: any;

  constructor() { }

  ngOnInit() { }

  add(event: MatChipInputEvent): void {
    if (event.value) {
      const currentValue = this.control.value;
      currentValue.push(event.value.trim());
      this.control.setValue(currentValue);
    }
    if (event.input) {
      event.input.value = '';
    }
  }

  remove(chip: string): void {
    const currentValue = this.control.value;
    const index = currentValue.indexOf(chip);
    if (index >= 0) {
      currentValue.splice(index, 1);
      this.control.setValue(currentValue);
    }
  }


}
