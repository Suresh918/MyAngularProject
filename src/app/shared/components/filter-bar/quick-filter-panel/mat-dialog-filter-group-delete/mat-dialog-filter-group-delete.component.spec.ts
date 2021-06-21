import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';

import {MatDialogFilterGroupDeleteComponent} from './mat-dialog-filter-group-delete.component';

describe('MatDialogFilterGroupDeleteComponent', () => {
  let fixture: ComponentFixture<MatDialogFilterGroupDeleteComponent>;
  let component: MatDialogFilterGroupDeleteComponent;

  const dialogMock = {
    close: () => { }
  };

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ReactiveFormsModule, BrowserModule, MatMenuModule],
      declarations: [MatDialogFilterGroupDeleteComponent],
      providers: [
        {provide: MatDialogRef, useValue: dialogMock},
        {provide: MAT_DIALOG_DATA, useValue: {}}]
    }).compileComponents();
    fixture = TestBed.createComponent(MatDialogFilterGroupDeleteComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('dialog should close ', () => {
    spyOn(component.dialogRef, 'close');
    component.close(true);
    expect(component.dialogRef.close).toHaveBeenCalled();
  });
});
