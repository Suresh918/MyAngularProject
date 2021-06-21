import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatInputTextComponent } from './mat-input-text.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

describe('MatInputTextComponent', () => {
  let fixture: ComponentFixture<MatInputTextComponent>;
  let component: MatInputTextComponent;
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ReactiveFormsModule, BrowserModule],
      declarations: [MatInputTextComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(MatInputTextComponent);
    component = fixture.componentInstance;

    /*Defining control since it's a input property for this component*/
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
});
