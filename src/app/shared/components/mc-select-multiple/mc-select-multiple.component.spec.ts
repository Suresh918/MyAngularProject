import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {FormControl} from '@angular/forms';

import { MCSelectMultipleComponent } from './mc-select-multiple.component';
import {metaReducers, reducers} from '../../../store';

describe('MCSelectMultipleComponent', () => {
  let component: MCSelectMultipleComponent;
  let fixture: ComponentFixture<MCSelectMultipleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCSelectMultipleComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ HttpClientModule, StoreModule.forRoot(reducers, {metaReducers})]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCSelectMultipleComponent);
    component = fixture.componentInstance;
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
