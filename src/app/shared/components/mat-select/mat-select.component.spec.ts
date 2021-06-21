import {MatSelectComponent} from './mat-select.component';
import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import {HistoryService} from '../../../core/services/history.service';

describe('MatSelectComponent', function () {
  let fixture: ComponentFixture<MatSelectComponent>;
  let component: MatSelectComponent;
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ReactiveFormsModule],
      declarations: [MatSelectComponent],
      providers: [{
        provide: HistoryService, useClass: HistoryServiceMock
      }]
    }).compileComponents();
    fixture = TestBed.createComponent(MatSelectComponent);
    component = fixture.componentInstance;
    component['control'] = new FormControl('actualVal', Validators.compose([
      Validators.required
    ]));
  }));
  it('component should be created', () => {
    expect(component).toBeTruthy();
  });

  it('control value require validation working', () => {
    component.control.setValue('');
    expect(component.control.valid).toBeFalsy();
  });

  it('should display actual input value', () => {
    expect(component.control.value).toEqual('actualVal');
  });

  it('description should be cleared', () => {
    component.descriptionControl = new FormControl('test');
    component.selectionChange({'value': {'name': ''}});
    expect(component.descriptionControl.value).toEqual('');
  });

  it('should call, setHistory with controlConfiguration enumeration when enumeration matches selectionChange parameter', () => {
    spyOn(component, 'setHistory');
    component.showOptionsHistory = true;
    component.selectionChange({'value': 'test'});
    expect(component.setHistory).toHaveBeenCalledWith({'name': 'test', 'label': '1234'});
  });

  it('should call, setHistory with null when enumeration doesnt match selectionChange parameter', () => {
    spyOn(component, 'setHistory');
    component.showOptionsHistory = true;
    component.selectionChange({'value': 'toast'});
    expect(component.setHistory).toHaveBeenCalledWith(null);
  });

  it('should set, description placeholder when changeDescription is true', () => {
    component.changeDescription = true;
    component.descriptionControlConfiguration = {
      placeholder: ''
    };
    component.control.setValue('test');
    component.selectionChange({'value': 'test'});
    expect(component.descriptionControlConfiguration.placeholder).toEqual('Please explain why you choose for a test strategy');
  });

  it('has validator should return the validation value', () => {
    expect(component.hasValidator()).toBe(true);
    component.control.clearValidators();
    expect(component.hasValidator()).toBe(false);
  });

  it('control value should be set on change', () => {
    component.control.setValue('new val');
    component.ngOnChanges();
    expect(component.control.value).toBe('new val');
  });

  it('should set history', function () {
    component.historyFormControl = new FormGroup({
      ID: new FormControl('test')
    });
    component.setHistory({ID: '1234'});
    expect(component.historyFormControl.value).toEqual({ID: '1234'});
  });
});

class HistoryServiceMock {
  setHistory(formControl: FormControl | FormGroup, newValue: any, type: string, size: number) {
    formControl.setValue(newValue);
  }
}

