import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';

import { MatDatePickerCustomizedComponent } from './mat-date-picker-customized.component';

describe('MatDatePickerCustomizedComponent', () => {
  let component: MatDatePickerCustomizedComponent;
  let fixture: ComponentFixture<MatDatePickerCustomizedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MatDatePickerCustomizedComponent, DateDisplayPipeMock ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule ],
      providers: [MatDatepickerModule, MatNativeDateModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatDatePickerCustomizedComponent);
    component = fixture.componentInstance;
    component.control = new FormControl({});
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should set datePickerSlection on initialization',  () => {
    component.control = new FormControl(new Date());
    component.type  = 'range';
    component.ngOnInit();
    const beginDate = component.datePickerSlection;
    const todayDate = new Date();
    expect(beginDate.getDay()).toEqual(todayDate.getDay());
  });

  it('should set value for control value on changeDateFormat triggered', () => {
    component.control = new FormControl({begin : new Date(),
      end : new Date()});
    component.type = 'range';
    const events = {value: new Date()};
    component.changeDateFormat(events, 'start');
    const beginDate = component.control.value.begin;
    const todayDate = new Date();
    expect(beginDate.getDay()).toEqual(todayDate.getDay());
  });

  it('should set value for control value on changeDateFormat triggered when type is not range', () => {
    component.type = 'range1';
    const events = {value: new Date()};
    component.changeDateFormat(events, 'start');
    const beginDate = component.selectedValue;
    const todayDate = new Date();
    expect(beginDate.getDay()).toEqual(todayDate.getDay());
  });

  it('should empty control value on changeDateFormat triggered ',  () => {
    component.control = new FormControl(new Date());
    component.type  = 'range';
    const events = {begin: new Date()};
    component.changeDateFormat(events, 'start');
    expect(component.control.value).toBe('');
  });

});
@Pipe({name: 'date'})
class DateDisplayPipeMock implements PipeTransform {
  transform(value: any, ...args): any {
    return '02:02:2020';
  }
}
