import {ComponentFixture, fakeAsync, inject, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';

import {MatDialogChangeTitleComponent} from './mat-dialog-change-title.component';
import {metaReducers, reducers} from '../../../store';

describe('MatDialogChangeTitleComponent', function () {
  let fixture: ComponentFixture<MatDialogChangeTitleComponent>;
  let component: MatDialogChangeTitleComponent;
  let dialog: MatDialog;
  let dialogRef: MatDialogRef<MatDialogChangeTitleComponent>;
  let control: FormControl;
  const dialogMock = {
    close: () => {
    }
  };
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ReactiveFormsModule, BrowserModule, MatDialogModule, BrowserAnimationsModule,
        StoreModule.forRoot(reducers, {metaReducers}), HttpClientModule],
      declarations: [MatDialogChangeTitleComponent],
      providers: [
        {provide: MatDialogRef, useValue: dialogMock},
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(MatDialogChangeTitleComponent);
    component = fixture.componentInstance;
    component.data = {
      titleControl: new FormControl('initial title'),
      control: new FormControl('aa'),
      statusControl: new FormControl('DRAFT'),
      statusControlConfiguration: {options: [{'name': 'DRAFT', 'label': 'Draft'}]},
      service: 'ChangeRequest'
    };
    component.statusCaseActionMapping = [];
    dialog = TestBed.get(MatDialog);
    control = new FormControl();
    control['dialogRef'] = dialogRef;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show the updated title', () => {
    component.title = 'New title';
    expect(component.title).toEqual('New title');
  });
  it('should update the value on close', inject([MAT_DIALOG_DATA], data => {
    component.data = data;
    data['control'] = control;
    control.setValue('new value');
    expect(component.data.control.value).toBe('new value');
  }));
  it('submit should work', inject([MAT_DIALOG_DATA], data => {
    component.data = data;
    data['control'] = control;
    const dialogCloseSpy = spyOn(component.dialogRef, 'close');
    fixture.detectChanges();
    component.submit();
    expect(dialogCloseSpy).toHaveBeenCalled();
  }));
  it('value should be set on close', inject([MAT_DIALOG_DATA], data => {
    component.data = data;
    data['control'] = control;
    data.titleControl = new FormControl('new value');
    data.titleControl.setErrors({'maxLength': true});
    component.close();
    expect(component.data.titleControl.value).toBe('initial title');
  }));
});
