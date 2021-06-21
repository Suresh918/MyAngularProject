import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {AbstractControl, FormControl} from '@angular/forms';
import {FormControlConfiguration} from '../../models/mc-configuration.model';

@Component({
  selector: 'mc-mat-date-picker',
  templateUrl: './mat-date-picker.component.html',
  styleUrls: ['./mat-date-picker.component.scss']
})
export class MatDatePickerComponent implements OnChanges, OnInit {
  @Input()
  control: FormControl;
  @Input()
  controlConfiguration: FormControlConfiguration;
  initialDate: Date;

  constructor() {
  }

  ngOnInit() {
    if (this.controlConfiguration && this.controlConfiguration.minDate) {
      this.controlConfiguration.minDate.setHours(0, 0, 0, 0);
    }
  }

  ngOnChanges() {
    if (this.control) {
      this.initialDate = new Date(this.control.value || '');
      this.initialDate.setHours(0, 0, 0, 0);
    }
  }

  clearDate() {
    this.control.setValue('');
  }

  hasValidator(): boolean {
    if (this.control && this.control.validator && this.control.validator({} as AbstractControl)) {
      return this.control.validator({} as AbstractControl).hasOwnProperty('required');
    } else {
      return false;
    }
  }

  minDateFilter = (d: Date): boolean => {
    d.setHours(0, 0, 0, 0);
    return (d.getTime() === this.initialDate.getTime() || d.getTime() >= this.controlConfiguration.minDate.getTime());
  };

}
