import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormControl} from '@angular/forms';
import {EndDateForm} from '../../models/mc-presentation.model';
import {FormControlConfiguration} from '../../models/mc-configuration.model';
import {formatDate} from '@angular/common';

@Component({
  selector: 'mc-mat-date-picker-customized',
  templateUrl: './mat-date-picker-customized.component.html',
  styleUrls: ['./mat-date-picker-customized.component.scss']
})
export class MatDatePickerCustomizedComponent implements OnInit {
  endDateForm: EndDateForm[];
  dateOptions: string[] = ['One Week', 'Two Weeks', 'Three Weeks', 'One Month', 'Two Months'];
  @Input()
  control: FormControl;
  @Input()
  controlConfiguration: FormControlConfiguration;
  @Input()
  type: string;
  selectedValue: Date;
  minDate: Date;
  datePickerSlection: any;
  today: Date;
  listValueSelected: boolean;
  beginDate: Date;
  dateRangeFormat: string;

  constructor() {
    this.listValueSelected = false;
  }

  ngOnInit() {
    if (this.type === 'range' && this.control.value) {
      this.datePickerSlection = this.control.value;
      this.selectedValue = this.control.value;
    } else {
      this.selectedValue = new Date(this.control.value);
      if (!this.listValueSelected) {
        this.datePickerSlection = this.selectedValue;
      }
    }
    this.endDateForm = [];
    this.today = new Date();
    this.minDate = this.today;
    this.dateOptions.forEach((date, idx) => {
      const tempDate = {};
      tempDate['name'] = date;
      tempDate['date'] = new Date(new Date().setDate(this.today.getDate() + ((idx + 1) * 7)));
      this.listValueSelected = this.listValueSelected || (new Date(this.control.value) === tempDate['Date']);
      this.endDateForm.push(tempDate);
    });
  }

  changeDateFormat(event, dateType) {
    if (event.value) {
      if (this.type === 'range' && !(event.value.begin)) {
        if (dateType === 'start') {
          this.beginDate = event.value;
        } else if (dateType === 'end') {
          this.control.setValue({
            begin: this.beginDate,
            end: event.value
          });
        } else {
          this.selectedValue = event.value;
          this.control.setValue(event.value);
        }
        const format = 'MMM dd, YYYY';
        const locale = 'en-US';
        if (this.datePickerSlection?.begin) {
          this.dateRangeFormat = formatDate(this.datePickerSlection?.begin, format, locale) + ' — ' +
            formatDate(this.datePickerSlection?.end, format, locale);
        }
      } else {
        this.control.setValue('');
      }
    }
  }
  hasValidator(): boolean {
    if (this.control && this.control.validator && this.control.validator({} as AbstractControl)) {
      return this.control.validator({} as AbstractControl).hasOwnProperty('required');
    } else {
      return false;
    }
  }
}
