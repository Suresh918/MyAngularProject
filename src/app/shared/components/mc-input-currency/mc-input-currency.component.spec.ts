import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {StoreModule} from '@ngrx/store';

import { MCInputCurrencyComponent } from './mc-input-currency.component';
import {metaReducers, reducers} from '../../../store';

describe('MCInputCurrencyComponent', () => {
  let component: MCInputCurrencyComponent;
  let fixture: ComponentFixture<MCInputCurrencyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCInputCurrencyComponent ],
      imports: [AALInputCurrencyModule, StoreModule.forRoot(reducers, {metaReducers}),
        HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCInputCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
