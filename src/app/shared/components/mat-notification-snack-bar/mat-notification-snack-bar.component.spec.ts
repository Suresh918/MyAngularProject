import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarModule, MatSnackBarRef} from '@angular/material/snack-bar';
import {RouterTestingModule} from '@angular/router/testing';

import {MatNotificationSnackBarComponent} from './mat-notification-snack-bar.component';


describe('MatNotificationSnackBarComponent', () => {
  let component: MatNotificationSnackBarComponent;
  let fixture: ComponentFixture<MatNotificationSnackBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MatNotificationSnackBarComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatSnackBarModule, RouterTestingModule],
      providers: [
        {provide: MatSnackBarRef, useValue: {}},
        {provide: MAT_SNACK_BAR_DATA, useValue: {}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatNotificationSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
