import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {FormControl} from '@angular/forms';

import { MCSelectSingleCaseActionComponent } from './mc-select-single-case-action.component';
import {metaReducers, reducers} from '../../../store';

describe('MCSelectSingleCaseActionComponent', () => {
  let component: MCSelectSingleCaseActionComponent;
  let fixture: ComponentFixture<MCSelectSingleCaseActionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCSelectSingleCaseActionComponent ],
      imports: [HttpClientModule, StoreModule.forRoot(reducers, {metaReducers})]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCSelectSingleCaseActionComponent);
    component = fixture.componentInstance;
    component.optionsList = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set value to selectControl when formControl value type is number',  () => {
    component.control = new FormControl(123456);
    expect(component.selectControl.value).toBe('123456');
  });
});
