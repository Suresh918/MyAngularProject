import {ComponentFixture, TestBed, fakeAsync} from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';

import {MatDatePickerComponent} from './mat-date-picker.component';

describe('MatDatePickerComponent', function () {
  let fixture: ComponentFixture<MatDatePickerComponent>;
  let component: MatDatePickerComponent;
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ MatDatepickerModule, BrowserModule, ReactiveFormsModule, MatNativeDateModule ],
      declarations: [MatDatePickerComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(MatDatePickerComponent);
    component = fixture.componentInstance;
    component['control'] = new FormControl(new Date(), Validators.compose([
      Validators.required
      ]));
    component['controlConfiguration'] = {};

  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('control value require validation working', () => {
    component.control.setValue('');
    expect(component.control.valid).toBeFalsy();
  });
  it('should show the correct value', () => {
    component.control.setValue(new Date());
    expect(component.control.value.getHours()).toEqual(new Date().getHours());
    expect(component.control.value.getDate()).toEqual(new Date().getDate());
    expect(component.control.value.getFullYear()).toEqual(new Date().getFullYear());
    expect(component.control.value.getMonth()).toEqual(new Date().getMonth());
  });
  it('should clear control value', () => {
    component.control.setValue(new Date());
    component.clearDate();
    expect(component.control.value).toBe('');
  });
  it('hasValidator function should return true as the control is required', () => {
    const hasValidatorRequired = component.hasValidator();
    expect(hasValidatorRequired).toBe(true);
  });
  it('should return false when validator required set to false', () => {
    component.control.clearValidators();
    const hasValidatorRequired = component.hasValidator();
    expect(hasValidatorRequired).toBe(false);
  });
  it('should update the initial value field with control value', () => {
    component.control.setValue(new Date());
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.initialDate.getDate()).toBe(new Date().getDate());
  });
  it('should make changes on min date on init', () => {
    component.controlConfiguration.minDate = new Date();
    component.ngOnInit();
    expect(component.controlConfiguration.minDate.getHours()).toBe(0);
  });
  it('should compare for min date and return', () => {
    const dateValue = new Date();
    component.initialDate = dateValue;
    component.controlConfiguration.minDate = dateValue;
    const isMindate = component.minDateFilter(dateValue);
    expect(isMindate).toBe(true);
  });
});
