import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MCAutoCompleteProductsAffectedMultipleComponent } from './mc-auto-complete-products-affected-multiple.component';

describe('MCAutoCompleteProductsAffectedMultipleComponent', () => {
  let component: MCAutoCompleteProductsAffectedMultipleComponent;
  let fixture: ComponentFixture<MCAutoCompleteProductsAffectedMultipleComponent>;
  const dialogMock = {
    close: () => { }
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCAutoCompleteProductsAffectedMultipleComponent ],
      imports: [ HttpClientModule, MatDialogModule ],
      providers: [
        {provide: MatDialogRef, useClass: dialogMock},
        {provide: MAT_DIALOG_DATA, useClass: {}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCAutoCompleteProductsAffectedMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
