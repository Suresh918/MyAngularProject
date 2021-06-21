import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {StoreModule} from '@ngrx/store';
import {HttpClientModule} from '@angular/common/http';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormControl} from '@angular/forms';

import {MCSelectSingleInputComponent} from './mc-select-single-input.component';
import {metaReducers, reducers} from '../../../store';

describe('MCSelectSingleInputComponent', () => {
  let component: MCSelectSingleInputComponent;
  let fixture: ComponentFixture<MCSelectSingleInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MCSelectSingleInputComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ HttpClientModule, StoreModule.forRoot(reducers, {metaReducers})]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCSelectSingleInputComponent);
    component = fixture.componentInstance;
    component.control = new FormControl('');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
