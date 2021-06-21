import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import {MatInputTextAreaComponent} from './mat-input-text-area.component';

describe('MatInputTextAreaComponent', () => {
  let fixture: ComponentFixture<MatInputTextAreaComponent>;
  let component: MatInputTextAreaComponent;
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ReactiveFormsModule, BrowserModule, MatSnackBarModule],
      declarations: [MatInputTextAreaComponent],
    }).compileComponents();
  fixture = TestBed.createComponent(MatInputTextAreaComponent);
  component = fixture.componentInstance;

  component['control'] = new FormControl('actualVal', Validators.compose([
    Validators.required,
    Validators.maxLength(4)
  ]));
  }));
  it('control value require validation working', () => {
    component.control.setValue('');
    expect(component.control.valid).toBeFalsy();
  });
  it('control value min length validation working', () => {
    component.control.setValue('invalidValue');
    expect(component.control.valid).toBeFalsy();
  });
  it('should display actual input value', () => {
    expect(component.control.value).toEqual('actualVal');
  });
  it('should display updated value', () => {
    component.control.setValue('updatedVal');
    expect(component.control.value).toEqual('updatedVal');
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
  it('should return length of control value', () => {
    component.control.setValue('new value');
    expect(component.getControlLength()).toBe(9);
    component.control.setValue('');
    expect(component.getControlLength()).toBe(0);
  });
});
