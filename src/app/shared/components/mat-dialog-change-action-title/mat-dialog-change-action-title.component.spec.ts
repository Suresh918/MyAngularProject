import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {HttpClientModule} from '@angular/common/http';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {MatDialogChangeActionTitleComponent} from './mat-dialog-change-action-title.component';
import {MCInputTextAreaComponent} from '../mc-input-text-area/mc-input-text-area.component';

describe('MatDialogChangeActionTitleComponent', () => {
  let component: MatDialogChangeActionTitleComponent;
  let fixture: ComponentFixture<MatDialogChangeActionTitleComponent>;
  const dialogMock = {
    close: () => { }
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MatDialogChangeActionTitleComponent, MCInputTextAreaComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatIconModule, HttpClientModule, ReactiveFormsModule, FormsModule],
      providers: [
        {provide: MatDialogRef, useValue: dialogMock},
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatDialogChangeActionTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('dialog should close ', () => {
    spyOn(component.dialogRef, 'close');
    component.data.control = new FormControl({test: 'test'});
    component.submit();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should set value to title to control on close', function () {
    component.data.control = new FormControl('');
    component.title = 'test title';
    component.close(true);
    expect(component.data.control.value).toBe('test title');
  });
});
