import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {FormControl} from '@angular/forms';

import { MCDatePickerRangeComponent } from './mc-date-picker-range.component';
import {metaReducers, reducers} from '../../../store';

describe('MCDatePickerRangeComponent', () => {
  let component: MCDatePickerRangeComponent;
  let fixture: ComponentFixture<MCDatePickerRangeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCDatePickerRangeComponent ],
      imports: [ HttpClientModule, StoreModule.forRoot(reducers, {metaReducers})]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCDatePickerRangeComponent);
    component = fixture.componentInstance;
    component.control = new FormControl();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
