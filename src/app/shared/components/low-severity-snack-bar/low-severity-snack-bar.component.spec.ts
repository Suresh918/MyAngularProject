import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSnackBarRef, MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';

import { LowSeveritySnackBarComponent } from './low-severity-snack-bar.component';

describe('LowSeveritySnackBarComponent', () => {
  let component: LowSeveritySnackBarComponent;
  let fixture: ComponentFixture<LowSeveritySnackBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LowSeveritySnackBarComponent ],
      imports: [MatSnackBarModule],
      providers: [{
        provide: MatSnackBarRef,
        useValue: {}
      }, {
        provide: MAT_SNACK_BAR_DATA,
        useValue: {} // Add any data you wish to test if it is passed/used correctly
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LowSeveritySnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
