import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {StoreModule} from '@ngrx/store';
import {HttpClientModule} from '@angular/common/http';

import { MCDatePickerComponent } from './mc-date-picker.component';
import {metaReducers, reducers} from '../../../store';


describe('MCDatePickerComponent', () => {
  let component: MCDatePickerComponent;
  let fixture: ComponentFixture<MCDatePickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCDatePickerComponent ],
      imports: [AALDatePickerModule, StoreModule.forRoot(reducers, {metaReducers}), HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
