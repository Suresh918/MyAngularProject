import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {FormControl} from '@angular/forms';


import { MCDatePickerSelectComponent } from './mc-date-picker-select.component';
import {metaReducers, reducers} from '../../../store';

describe('MCDatePickerSelectComponent', () => {
  let component: MCDatePickerSelectComponent;
  let fixture: ComponentFixture<MCDatePickerSelectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCDatePickerSelectComponent ],
      imports: [AALDatePickerSelectModule, HttpClientModule, StoreModule.forRoot(reducers, {metaReducers})]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCDatePickerSelectComponent);
    component = fixture.componentInstance;
    component.control = new FormControl();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
