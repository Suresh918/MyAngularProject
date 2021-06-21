import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {StoreModule} from '@ngrx/store';

import { MCInputNumberComponent } from './mc-input-number.component';
import {metaReducers, reducers} from '../../../store';

describe('MCInputNumberComponent', () => {
  let component: MCInputNumberComponent;
  let fixture: ComponentFixture<MCInputNumberComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MCInputNumberComponent ],
      imports: [StoreModule.forRoot(reducers, {metaReducers}),
        HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCInputNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
