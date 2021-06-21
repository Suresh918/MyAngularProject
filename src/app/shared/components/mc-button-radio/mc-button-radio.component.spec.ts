import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';

import { MCButtonRadioComponent } from './mc-button-radio.component';
import {metaReducers, reducers} from '../../../store';

describe('MCButtonRadioComponent', () => {
  let component: MCButtonRadioComponent;
  let fixture: ComponentFixture<MCButtonRadioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MCButtonRadioComponent],
      imports: [StoreModule.forRoot(reducers, {metaReducers}), AALButtonRadioModule, HttpClientModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MCButtonRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
