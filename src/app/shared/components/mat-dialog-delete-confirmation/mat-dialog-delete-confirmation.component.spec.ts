import {ComponentFixture, TestBed, fakeAsync} from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {MatDialogDeleteConfirmationComponent} from './mat-dialog-delete-confirmation.component';

describe('MatDialogDeleteConfirmationComponent', function () {
  let fixture: ComponentFixture<MatDialogDeleteConfirmationComponent>;
  let component: MatDialogDeleteConfirmationComponent;
  const dialogMock = {
    close: () => {
    }
  };
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [MatDialogDeleteConfirmationComponent],
      imports: [MatDialogModule],
      providers: [
        {provide: MatDialogRef, useValue: dialogMock},
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(MatDialogDeleteConfirmationComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
   expect(component).toBeTruthy();
 });

  it('dialog should close onYes triggered', () => {
    spyOn(component.dialogRef, 'close');
    component.onYes();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('dialog should close onNoClick triggered', () => {
    spyOn(component.dialogRef, 'close');
    component.onNoClick();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });
});
