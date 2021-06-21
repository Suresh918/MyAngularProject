import {ComponentFixture, TestBed, fakeAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';


import {MatDialogNavigationConfirmationComponent} from './mat-dialog-navigation-confirmation.component';

describe('MatDialogNavigationConfirmationComponent', function () {
  let fixture: ComponentFixture<MatDialogNavigationConfirmationComponent>;
  let component: MatDialogNavigationConfirmationComponent;
  const dialogMock = {
    close: () => {
    }
  };
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [BrowserModule, RouterModule],
      declarations: [MatDialogNavigationConfirmationComponent],
      providers: [
        {provide: MatDialogRef, useValue: dialogMock},
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(MatDialogNavigationConfirmationComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set message on initialization', () => {
    component.data = {message: 'test message', isCaseObject: 'test Data'};
    component.ngOnInit();
    expect(component.message).toBe('test message');
  });

  it('dialog should close onYesClick triggered', () => {
    spyOn(component.dialogRef, 'close');
    component.onYesClick();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('dialog should close onNoClick triggered', () => {
    spyOn(component.dialogRef, 'close');
    component.onNoClick();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });
});
