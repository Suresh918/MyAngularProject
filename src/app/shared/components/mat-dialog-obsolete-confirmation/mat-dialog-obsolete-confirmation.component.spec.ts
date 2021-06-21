import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';

import {MatDialogObsoleteConfirmationComponent} from './mat-dialog-obsolete-confirmation.component';

describe('MatDialogObsoleteConfirmationComponent', function () {
  let fixture: ComponentFixture<MatDialogObsoleteConfirmationComponent>;
  let component: MatDialogObsoleteConfirmationComponent;
  const dialogMock = {
    close: () => { }
  };
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [MatDialogObsoleteConfirmationComponent],
      imports: [MatSnackBarModule, MatDialogModule],
      providers: [
        {provide: MatDialogRef, useValue: dialogMock},
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(MatDialogObsoleteConfirmationComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('dialog should close onYesClick triggered', () => {
    spyOn(component.dialogRef, 'close');
    component.onYesClick();
    expect(component.dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('dialog should close onNoClick triggered', () => {
    spyOn(component.dialogRef, 'close');
    component.onNoClick();
    expect(component.dialogRef.close).toHaveBeenCalledWith(false);
  });
});
